# SMS Interaction Flow

## Overview
The SMS interaction system allows users to report buys and sells via text message, making position management quick and convenient.

## Buy Reporting

### Simple Buy Format
```
BUY SOL 100 @ 175.43
```
- Creates a new position with 100 SOL at $175.43
- System responds with confirmation and current value

### Buy with Stop Loss/Take Profit
```
BUY LINK 500 @ 17.82 SL15 TP50
```
- Buys 500 LINK at $17.82
- Sets 15% stop loss and 50% take profit
- System confirms with risk parameters

### Buy with Notes
```
BUY CCJ 200 @ 52.15 "Nuclear play on AI datacenter demand"
```
- Includes a note for future reference
- Useful for tracking investment thesis

## Sell Reporting

### Full Position Sale
```
SELL SOL
```
- Sells entire SOL position at current market price
- System calculates and reports profit/loss

### Partial Sale
```
SELL SOL 50 @ 180
```
- Sells 50 SOL at $180
- Updates position with remaining quantity
- Reports realized gains

### Sale with Notes
```
SELL LINK @ 19.50 "Taking profits before resistance"
```
- Records exit reasoning
- Helps track decision quality over time

## System Responses

### Buy Confirmation
```
✅ Bought 100 SOL @ $175.43
Total Value: $17,543
Portfolio: $417,543 (+1.04% today)
```

### Sell Confirmation
```
💰 Sold 50 SOL @ $180
Profit: +$271.50 (+3.1%)
Remaining: 235.7 SOL
Portfolio: $412,500 (+0.3% today)
```

### Error Handling
```
❌ Insufficient quantity. You have 100 SOL
(Requested to sell 200)
```

## Additional Commands

### Check Position
```
CHECK SOL
```
Response:
```
SOL Position:
Qty: 285.7 | Avg: $140
Current: $175.43 (+25.3%)
Value: $50,122
SL: -15% | TP: +50%
```

### Portfolio Summary
```
PORTFOLIO
```
Response:
```
Portfolio: $412,500
Today: +$4,238 (+1.06%)
Goal Progress: 37.5%
Top: SOL +$10,122
```

### Set Alerts
```
ALERT SOL 165
```
- Sets price alert at $165
- Can be above or below current price

### Cancel Position Tracking
```
REMOVE ONDO
```
- Removes from watchlist
- Stops all alerts

## Integration with Web App

1. **Real-time Sync**: SMS actions immediately update web dashboard
2. **Notification Preferences**: Users can set which events trigger SMS alerts
3. **Daily Summary**: Optional morning text with positions and market analysis
4. **Two-way Sync**: Web actions can trigger SMS confirmations

## Security

1. **Phone Verification**: Initial setup requires phone number verification
2. **Confirmation Codes**: Large trades may require confirmation code
3. **Daily Limits**: Configurable daily transaction limits
4. **Whitelist**: Only registered phone numbers can execute trades

## Future Enhancements

1. **Voice Commands**: Call to report trades via voice
2. **WhatsApp Integration**: Alternative to SMS
3. **Multi-language Support**: Commands in user's preferred language
4. **Advanced Orders**: OCO, trailing stops via SMS