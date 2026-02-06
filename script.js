// State management
const appState = {
    soreness: 3,
    motivation: 3,
    hrv: null,
    hrvBaseline: 65, // Example baseline HRV in ms
    sleep: null,
    readiness: null,
    basePlan: {
        type: "Easy Run",
        distance: "8 miles",
        pace: "7:30-8:00 min/mile",
        duration: "~60 minutes"
    },
    actualPlan: null,
    isModified: false,
    modificationReason: ""
};

// Tough love messages for different scenarios
const toughLoveMessages = {
    highSoreness: {
        title: "LISTEN TO YOUR BODY",
        message: "You're beat up. I don't care how tough you think you are—running hard on tired legs is how champions become has-beens. We're scaling back today because smart training beats stupid bravado every single time. Your ego might hate this, but your race results will thank me.",
        signature: "— This is non-negotiable"
    },
    lowMotivation: {
        title: "MENTAL STATE MATTERS",
        message: "Your head's not in it today. That's fine—you're human, not a machine. But we don't skip workouts, we adapt them. This modified session keeps you in the game without digging a hole you'll regret tomorrow. Show up, do the work, and trust the process.",
        signature: "— Discipline beats motivation"
    },
    lowHRV: {
        title: "PHYSIOLOGY DOESN'T LIE",
        message: "Your HRV is screaming that your nervous system is fried. You can't fake recovery. Push hard today and you'll be sitting on the couch next week wondering why you're always injured. We're backing off because I care more about your long-term success than today's workout high.",
        signature: "— Data > Feelings"
    },
    poorSleep: {
        title: "SLEEP IS NON-NEGOTIABLE",
        message: "You slept like garbage and now you want to crush a hard workout? That's not courage, that's stupidity. Recovery happens during sleep, and without it, you're just accumulating damage. This lighter session protects your investment in training. No arguments.",
        signature: "— Champions are built in bed"
    },
    combined: {
        title: "MULTIPLE RED FLAGS",
        message: "Multiple systems are compromised right now. This isn't about being soft—it's about being smart. The athletes who ignore these signals are the ones posting 'injured again' updates in a few weeks. We're adapting because consistent mediocre training beats boom-and-bust heroics every damn time.",
        signature: "— This is how professionals think"
    }
};

// DOM Elements
const sorenessSlider = document.getElementById('soreness');
const motivationSlider = document.getElementById('motivation');
const sorenessValue = document.getElementById('soreness-value');
const motivationValue = document.getElementById('motivation-value');
const morningForm = document.getElementById('morning-ritual-form');
const syncButton = document.getElementById('sync-healthkit');
const dailyDirectiveSection = document.getElementById('daily-directive');
const modificationAlert = document.getElementById('modification-alert');
const modificationReason = document.getElementById('modification-reason');
const actualPlanDiv = document.getElementById('actual-plan');
const toughLoveDiv = document.getElementById('tough-love-message');
const acknowledgeButton = document.getElementById('acknowledge-directive');
const arrowIndicator = document.getElementById('arrow-indicator');

// Initialize slider displays
sorenessSlider.addEventListener('input', (e) => {
    appState.soreness = parseInt(e.target.value);
    sorenessValue.textContent = e.target.value;
});

motivationSlider.addEventListener('input', (e) => {
    appState.motivation = parseInt(e.target.value);
    motivationValue.textContent = e.target.value;
});

// Calculate subjective score (average of soreness and motivation, inverted for soreness)
function calculateSubjectiveScore() {
    // Invert soreness (5 is bad, 1 is good) and average with motivation
    const invertedSoreness = 6 - appState.soreness;
    return (invertedSoreness + appState.motivation) / 2;
}

// Simulate HealthKit sync
function syncHealthKit() {
    syncButton.disabled = true;
    syncButton.textContent = '🔄 Syncing...';

    // Simulate API call delay
    setTimeout(() => {
        // Generate realistic but random health data
        appState.hrv = Math.floor(Math.random() * (80 - 45) + 45); // 45-80ms
        appState.sleep = Math.floor(Math.random() * (10 - 4) + 4); // 4-10 hours

        // Calculate readiness score (0-100)
        const hrvPercentOfBaseline = (appState.hrv / appState.hrvBaseline) * 100;
        const sleepScore = (appState.sleep / 8) * 100; // Assuming 8 hours is optimal
        const subjectiveScore = calculateSubjectiveScore() * 20; // Convert 1-5 scale to percentage

        appState.readiness = Math.floor((hrvPercentOfBaseline + sleepScore + subjectiveScore) / 3);

        // Update UI
        updateHealthMetrics();

        syncButton.disabled = false;
        syncButton.textContent = '✓ Data Synced';

        setTimeout(() => {
            syncButton.textContent = '🔄 Sync HealthKit Data';
        }, 2000);
    }, 1500);
}

function updateHealthMetrics() {
    // HRV
    const hrvValue = document.getElementById('hrv-value');
    const hrvStatus = document.getElementById('hrv-status');
    hrvValue.textContent = `${appState.hrv} ms`;

    const hrvPercentOfBaseline = (appState.hrv / appState.hrvBaseline) * 100;
    if (hrvPercentOfBaseline >= 85) {
        hrvStatus.textContent = 'Optimal';
        hrvStatus.className = 'metric-status good';
    } else if (hrvPercentOfBaseline >= 70) {
        hrvStatus.textContent = 'Good';
        hrvStatus.className = 'metric-status warning';
    } else {
        hrvStatus.textContent = 'Low';
        hrvStatus.className = 'metric-status poor';
    }

    // Sleep
    const sleepValue = document.getElementById('sleep-value');
    const sleepStatus = document.getElementById('sleep-status');
    sleepValue.textContent = `${appState.sleep.toFixed(1)} hrs`;

    if (appState.sleep >= 7) {
        sleepStatus.textContent = 'Good';
        sleepStatus.className = 'metric-status good';
    } else if (appState.sleep >= 6) {
        sleepStatus.textContent = 'Fair';
        sleepStatus.className = 'metric-status warning';
    } else {
        sleepStatus.textContent = 'Poor';
        sleepStatus.className = 'metric-status poor';
    }

    // Readiness
    const readinessValue = document.getElementById('readiness-value');
    const readinessStatus = document.getElementById('readiness-status');
    readinessValue.textContent = `${appState.readiness}%`;

    if (appState.readiness >= 80) {
        readinessStatus.textContent = 'Ready';
        readinessStatus.className = 'metric-status good';
    } else if (appState.readiness >= 65) {
        readinessStatus.textContent = 'Moderate';
        readinessStatus.className = 'metric-status warning';
    } else {
        readinessStatus.textContent = 'Fatigued';
        readinessStatus.className = 'metric-status poor';
    }
}

// Calculate workout modification based on rules
function calculateWorkoutDirective() {
    const subjectiveScore = calculateSubjectiveScore();
    const hrvPercentOfBaseline = (appState.hrv / appState.hrvBaseline) * 100;

    // Rule: if Subjective < 2 OR HRV < 15% of baseline, downgrade
    const shouldDowngrade = subjectiveScore < 2 || hrvPercentOfBaseline < 85;

    let reasons = [];
    let primaryReason = null;

    if (appState.soreness >= 4) {
        reasons.push('high muscle soreness');
        primaryReason = primaryReason || 'highSoreness';
    }
    if (appState.motivation <= 2) {
        reasons.push('low mental motivation');
        primaryReason = primaryReason || 'lowMotivation';
    }
    if (hrvPercentOfBaseline < 85) {
        reasons.push(`HRV at ${hrvPercentOfBaseline.toFixed(0)}% of baseline`);
        primaryReason = primaryReason || 'lowHRV';
    }
    if (appState.sleep < 6.5) {
        reasons.push('insufficient sleep');
        primaryReason = primaryReason || 'poorSleep';
    }

    if (shouldDowngrade) {
        appState.isModified = true;
        appState.modificationReason = reasons.length > 1
            ? `Multiple factors indicate reduced readiness: ${reasons.join(', ')}.`
            : `Your system is showing ${reasons[0]}.`;

        // Determine workout modification based on severity
        const severity = appState.readiness;

        if (severity < 50) {
            appState.actualPlan = {
                type: "Recovery Walk + Mobility",
                distance: "2-3 miles walking",
                pace: "Easy conversational",
                duration: "30-40 minutes"
            };
        } else if (severity < 70) {
            appState.actualPlan = {
                type: "Easy Run (Modified)",
                distance: "4-5 miles",
                pace: "8:30-9:00 min/mile",
                duration: "40-45 minutes"
            };
        } else {
            appState.actualPlan = {
                type: "Easy Run (Shortened)",
                distance: "6 miles",
                pace: "8:00-8:30 min/mile",
                duration: "48-52 minutes"
            };
        }

        // Select appropriate tough love message
        const messageKey = reasons.length > 1 ? 'combined' : primaryReason;
        const message = toughLoveMessages[messageKey];

        return message;
    } else {
        appState.isModified = false;
        appState.actualPlan = appState.basePlan;
        return null;
    }
}

// Display the daily directive
function displayDailyDirective() {
    const toughLoveMessage = calculateWorkoutDirective();

    // Show the section
    dailyDirectiveSection.style.display = 'block';

    // Update modification alert
    if (appState.isModified) {
        modificationAlert.style.display = 'flex';
        modificationReason.textContent = appState.modificationReason;
        arrowIndicator.textContent = '⚠️';
        arrowIndicator.classList.add('modified');
        document.querySelector('.actual-plan').classList.add('modified');
    } else {
        modificationAlert.style.display = 'none';
        arrowIndicator.textContent = '→';
        arrowIndicator.classList.remove('modified');
        document.querySelector('.actual-plan').classList.remove('modified');
    }

    // Update actual plan
    actualPlanDiv.innerHTML = `
        <div class="workout-type">${appState.actualPlan.type}</div>
        <div class="workout-details">
            <p><strong>Distance:</strong> ${appState.actualPlan.distance}</p>
            <p><strong>Pace:</strong> ${appState.actualPlan.pace}</p>
            <p><strong>Duration:</strong> ${appState.actualPlan.duration}</p>
        </div>
    `;

    // Display tough love message if modified
    if (toughLoveMessage) {
        toughLoveDiv.innerHTML = `
            <h3>${toughLoveMessage.title}</h3>
            <p>${toughLoveMessage.message}</p>
            <p class="signature">${toughLoveMessage.signature}</p>
        `;
        toughLoveDiv.style.display = 'block';
    } else {
        toughLoveDiv.innerHTML = `
            <h3>YOU'RE READY</h3>
            <p>All systems are green. Your body is recovered, your mind is sharp, and the data backs it up. This is what we train for. Execute the plan with confidence and precision. No excuses, no holding back—this is your day to perform.</p>
            <p class="signature">— Go earn it</p>
        `;
        toughLoveDiv.style.display = 'block';
    }

    // Scroll to directive
    dailyDirectiveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Event Listeners
morningForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if health data has been synced
    if (appState.hrv === null) {
        alert('Please sync your HealthKit data first to get your complete Daily Directive.');
        syncButton.focus();
        return;
    }

    displayDailyDirective();
});

syncButton.addEventListener('click', syncHealthKit);

acknowledgeButton.addEventListener('click', () => {
    alert('Directive acknowledged! Now get out there and execute. 💪');
    // In a real app, this would mark the directive as acknowledged and potentially send notifications
});

// Initialize with some default health data for demo purposes
// Remove this in production to force HealthKit sync
setTimeout(() => {
    // Auto-sync on page load for demo
    // syncHealthKit();
}, 500);
