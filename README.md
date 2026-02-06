# Bowerman - Daily Adaptive Re-calibration Flow UI Prototype

A web-based UI prototype for the Daily Adaptive Re-calibration Flow feature, designed to help serious athletes reconcile their training plan with their actual physical readiness every morning.

## Features

### 1. Morning Ritual Form
- **Soreness Level Tracking**: Visual slider (1-5 scale) to log muscle soreness
- **Motivation Level Tracking**: Visual slider (1-5 scale) to log mental readiness
- Real-time value display as user adjusts sliders

### 2. Recovery Metrics Dashboard
- **HRV (Heart Rate Variability)**: Synced from HealthKit with baseline comparison
- **Sleep Quality**: Hours of sleep with quality assessment
- **Readiness Score**: Composite score (0-100%) based on all metrics
- Color-coded status indicators (Good/Warning/Poor)
- One-click HealthKit sync button

### 3. Daily Directive Display
- **Base Plan vs Actual Plan Comparison**: Side-by-side view showing original plan and modified directive
- **Modification Alert**: Clear visual indicator when workout has been downgraded
- **Adaptive Workout Intensity**: Automatically adjusts based on:
  - Subjective score < 2 (average of inverted soreness + motivation)
  - HRV < 85% of baseline
  - Poor sleep quality
  - Low motivation or high soreness

### 4. "Tough Love" Messaging
Contextual motivational messages with a direct, no-nonsense tone:
- **High Soreness**: "Listen to your body" message
- **Low Motivation**: "Discipline beats motivation" message
- **Low HRV**: "Data > Feelings" message
- **Poor Sleep**: "Champions are built in bed" message
- **Multiple Factors**: Combined warning message
- **All Clear**: "You're ready" message when all systems are go

### 5. Workout Modification Logic
Automatic workout intensity adjustment based on readiness score:
- **Readiness < 50%**: Recovery walk + mobility (30-40 min)
- **Readiness 50-70%**: Modified easy run (4-5 miles, slower pace)
- **Readiness 70-85%**: Shortened easy run (6 miles)
- **Readiness > 85%**: Full base plan execution

## How to Use

1. **Open the Application**: Open `index.html` in a web browser
2. **Sync Health Data**: Click "Sync HealthKit Data" to pull in HRV and sleep metrics (simulated for prototype)
3. **Log Morning Ritual**: Adjust the soreness and motivation sliders to reflect current state
4. **Submit Check-In**: Click "Submit Morning Check-In" to generate your Daily Directive
5. **Review Directive**: See your personalized workout plan with "tough love" guidance
6. **Acknowledge**: Click "I Got It - Let's Go" to confirm understanding

## Technical Implementation

### File Structure
```
bowerman/
├── index.html       # Main HTML structure
├── styles.css       # Responsive CSS styling
├── script.js        # Application logic and state management
└── README.md        # This file
```

### Technologies
- **Pure HTML5/CSS3/JavaScript** (no frameworks)
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, athletic aesthetic with smooth animations
- **Accessible**: Semantic HTML and ARIA-compliant components

### State Management
The application uses a simple JavaScript object to manage state:
- User inputs (soreness, motivation)
- Health metrics (HRV, sleep, readiness)
- Base plan and modified plan
- Modification logic and reasoning

### Modification Algorithm
```javascript
// Downgrade if subjective score < 2 OR HRV < 85% of baseline
const subjectiveScore = (invertedSoreness + motivation) / 2;
const hrvPercentOfBaseline = (currentHRV / baselineHRV) * 100;
const shouldDowngrade = subjectiveScore < 2 || hrvPercentOfBaseline < 85;
```

## Future Enhancements

### Backend Integration
- Real HealthKit API integration (iOS)
- User authentication and profile management
- Historical data tracking and trends
- Persistent storage of training plans

### Features
- Morning notification triggers (push notifications)
- Training plan import/export
- Progress tracking over time
- Coach override capabilities
- Social sharing of achievements

### Analytics
- Recovery pattern analysis
- Correlation between metrics and performance
- Predictive readiness modeling
- Injury risk assessment

## Design Philosophy

This UI embodies the "Tough Love" coaching philosophy:
- **Direct Communication**: No sugar-coating or excessive positivity
- **Data-Driven**: Decisions based on objective metrics, not feelings
- **Athlete-Centric**: Respects the user's dedication while protecting long-term health
- **Professional Grade**: Clean, distraction-free interface focused on actionable information

## Acceptance Criteria Status

- ✅ Trigger for 'Morning Ritual' (Soreness/Motivation log)
- ✅ Background sync with HealthKit (simulated for prototype)
- ✅ Logical check: downgrade if Subjective < 2 OR HRV < 85% baseline
- ✅ UI displays 'Daily Directive' with clear deviation indication
- ✅ Persistent 'Tough Love' tone in modifications
- ✅ Web UI implementation

## Demo Notes

The prototype currently simulates HealthKit data for demonstration purposes. In production:
- Replace `syncHealthKit()` with actual HealthKit API calls
- Implement proper authentication and data persistence
- Add real push notification triggers for morning rituals
- Connect to a training plan database
- Implement coach/athlete communication features

---

**Built for serious athletes who demand both honesty and results.**
