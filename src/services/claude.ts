import Anthropic from '@anthropic-ai/sdk'

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StockAnalysis {
  symbol: string
  name: string
  currentPrice: number
  momentum: 'strong' | 'moderate' | 'building'
  confidence: number
  reason: string
  requiredInvestment: {
    aggressive: number
    balanced: number
    conservative: number
  }
  estimatedTime: {
    aggressive: string
    balanced: string
    conservative: string
  }
}

export class ClaudeService {
  private systemPrompt = `You are an AI investment assistant helping users create goal-based investment portfolios. 
Your role is to:
1. Analyze stocks and market conditions
2. Suggest investment opportunities based on user goals
3. Calculate required investments for different time horizons
4. Provide clear, actionable insights

Important guidelines:
- Be concise and practical
- Focus on probability of achieving goals, not maximum returns
- Consider risk levels for different time horizons
- Always include disclaimers about investment risks
- Use current market data when available`

  async sendMessage(messages: ChatMessage[], context?: any): Promise<string> {
    try {
      const contextPrompt = context ? `\nCurrent context: ${JSON.stringify(context)}` : ''
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Using Haiku for speed and cost efficiency
        max_tokens: 1024,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        system: this.systemPrompt + contextPrompt
      })

      return response.content[0].type === 'text' ? response.content[0].text : ''
    } catch (error) {
      console.error('Claude API error:', error)
      throw new Error('Failed to get response from Claude')
    }
  }

  async analyzeStockForGoal(
    symbol: string, 
    goalAmount: number,
    additionalContext?: string
  ): Promise<StockAnalysis> {
    const prompt = `Analyze ${symbol} for a $${goalAmount} investment goal.
${additionalContext || ''}

Please provide:
1. Current price estimate (if you don't have exact data, provide a reasonable estimate)
2. Momentum assessment (strong/moderate/building)
3. Confidence level (0-100)
4. Brief reason for recommendation
5. Required investment amounts for aggressive (2-4 weeks), balanced (1-3 months), and conservative (3-6 months) time horizons
6. Estimated time to reach goal for each horizon

Format as JSON.`

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        system: 'You are a stock market analyst. Provide realistic analysis based on general market knowledge. Return valid JSON only.'
      })

      const content = response.content[0].type === 'text' ? response.content[0].text : '{}'
      
      // Parse the JSON response
      try {
        const analysis = JSON.parse(content)
        return {
          symbol: symbol.toUpperCase(),
          name: analysis.name || symbol,
          currentPrice: analysis.currentPrice || 100,
          momentum: analysis.momentum || 'moderate',
          confidence: analysis.confidence || 70,
          reason: analysis.reason || 'Analysis based on current market conditions',
          requiredInvestment: {
            aggressive: goalAmount * (analysis.aggressive_multiplier || 2.5),
            balanced: goalAmount * (analysis.balanced_multiplier || 4),
            conservative: goalAmount * (analysis.conservative_multiplier || 6)
          },
          estimatedTime: {
            aggressive: analysis.aggressive_time || '2-4 weeks',
            balanced: analysis.balanced_time || '1-3 months',
            conservative: analysis.conservative_time || '3-6 months'
          }
        }
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          symbol: symbol.toUpperCase(),
          name: symbol,
          currentPrice: 100,
          momentum: 'moderate',
          confidence: 70,
          reason: 'Analysis in progress',
          requiredInvestment: {
            aggressive: goalAmount * 2.5,
            balanced: goalAmount * 4,
            conservative: goalAmount * 6
          },
          estimatedTime: {
            aggressive: '2-4 weeks',
            balanced: '1-3 months',
            conservative: '3-6 months'
          }
        }
      }
    } catch (error) {
      console.error('Stock analysis error:', error)
      throw new Error('Failed to analyze stock')
    }
  }

  async getSimilarStocks(symbol: string, sector?: string): Promise<string[]> {
    const prompt = `Given ${symbol}${sector ? ` in the ${sector} sector` : ''}, suggest 2-3 similar stocks or alternatives that investors might consider. Return only the ticker symbols as a comma-separated list.`

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
        system: 'Return only ticker symbols, comma-separated, no other text.'
      })

      const content = response.content[0].type === 'text' ? response.content[0].text : ''
      return content.split(',').map(s => s.trim()).filter(s => s.length > 0)
    } catch (error) {
      console.error('Similar stocks error:', error)
      return [] // Return empty array on error
    }
  }
}

// Export singleton instance
export const claudeService = new ClaudeService()