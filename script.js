// Global color palette (same as before, but good to keep it defined)
const brilliantBlues = {
    primary: '#007BFF',
    secondary: '#00C6FF',
    accent: '#4ADEDE',
    light: '#F7FAFC',
    dark: '#4A5568',
    text: 'rgba(247, 250, 252, 0.8)'
};

// Helper function for text wrapping in Chart.js labels (for better readability)
function wrapText(str, maxLength = 16) {
    const words = str.split(' ');
    let currentLine = '';
    const lines = [];
    for (let word of words) {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += word + ' ';
    }
    lines.push(currentLine.trim());
    return lines;
}

// Chart.js tooltip callback for wrapped labels
const tooltipTitleCallback = (tooltipItems) => {
    const item = tooltipItems[0];
    let label = item.chart.data.labels[item.dataIndex];
    if (Array.isArray(label)) {
        return label.join(' '); // Join wrapped text for tooltip
    }
    return label;
};

// Common Chart.js options for consistent styling
const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: brilliantBlues.text,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            callbacks: {
                title: tooltipTitleCallback,
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    // Add specific info for certain charts
                    if (context.chart.id === 'memoryChart' && context.dataset.label === 'Duration') {
                        label += ' sec';
                    } else if (context.chart.id === 'attentionChart') {
                        label += ' min';
                    } else if (context.chart.id === 'motivationChart') {
                         label += '/10';
                    } else if (context.chart.id === 'copingChart') {
                         label += '/10';
                    }
                    return label;
                }
            },
            backgroundColor: 'rgba(45, 55, 72, 0.9)', // Darker background for tooltips
            titleColor: brilliantBlues.secondary,
            bodyColor: brilliantBlues.light,
            borderColor: brilliantBlues.accent,
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: false // Hide color box in tooltip
        }
    },
    scales: {
        r: { // For Radar Chart
            angleLines: { color: brilliantBlues.dark },
            grid: { color: brilliantBlues.dark },
            pointLabels: {
                color: brilliantBlues.text,
                font: { size: 12 }
            },
            ticks: {
                backdropColor: 'rgba(0,0,0,0.5)',
                color: brilliantBlues.light,
                display: false // Hide numerical ticks on radar chart for cleaner look
            }
        },
        x: { // For Bar Charts
            ticks: { color: brilliantBlues.text, font: { size: 12 } },
            grid: { color: 'rgba(74, 85, 104, 0.3)' }, // Lighter grid lines
            border: { display: false } // Hide x-axis border line
        },
        y: { // For Bar Charts
            ticks: { color: brilliantBlues.text, font: { size: 12 } },
            grid: { color: 'rgba(74, 85, 104, 0.3)' },
            beginAtZero: true,
            border: { display: false } // Hide y-axis border line
        }
    }
};

// --- Chart Initializations (No Changes, per request) ---

// Branches Chart (Doughnut)
new Chart(document.getElementById('branchesChart'), {
    type: 'doughnut',
    data: {
        labels: ['Clinical Psychology', 'Cognitive Psychology', 'Social Psychology', 'Positive Psychology'],
        datasets: [{
            label: 'Focus for Self-Understanding',
            data: [35, 25, 20, 20],
            backgroundColor: [brilliantBlues.primary, brilliantBlues.secondary, brilliantBlues.accent, '#38B2AC'],
            borderColor: '#1a202c',
            borderWidth: 4,
            hoverOffset: 10 // Pop out on hover
        }]
    },
    options: {
        ...commonChartOptions,
        scales: {}, // Doughnut charts don't use typical scales
        plugins: {
            ...commonChartOptions.plugins,
            tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                    title: tooltipTitleCallback,
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + '%';
                        }
                        return label;
                    }
                }
            }
        }
    }
});

// Memory Chart (Horizontal Bar)
new Chart(document.getElementById('memoryChart'), {
    type: 'bar',
    data: {
        labels: ['Sensory Memory', 'Short-Term Memory', 'Long-Term Memory'],
        datasets: [
            {
                label: 'Relative Duration (Higher = Longer)',
                data: [1, 20, 100],
                backgroundColor: brilliantBlues.primary,
                borderRadius: 4,
            },
            {
                label: 'Relative Capacity (Higher = More)',
                data: [5, 10, 100],
                backgroundColor: brilliantBlues.accent,
                borderRadius: 4,
            }
        ]
    },
    options: {
        ...commonChartOptions,
        indexAxis: 'y', // Make it horizontal
        plugins: {
            ...commonChartOptions.plugins,
            legend: { display: true } // Show legend for this chart
        }
    }
});

// Attention Chart (Bar)
new Chart(document.getElementById('attentionChart'), {
    type: 'bar',
    data: {
        labels: ['Baby Boomers', 'Gen X', 'Millennials', wrapText('Gen Z & Alpha')],
        datasets: [{
            label: 'Sustained Attention Span (Hypothetical Minutes)',
            data: [15, 12, 9, 7],
            backgroundColor: [brilliantBlues.primary, brilliantBlues.secondary, brilliantBlues.accent, '#38B2AC'],
            borderRadius: 4,
        }]
    },
    options: {
        ...commonChartOptions,
        plugins: {
            ...commonChartOptions.plugins,
            legend: { display: false } // Hide legend
        }
    }
});

// Motivation Chart (Radar)
new Chart(document.getElementById('motivationChart'), {
    type: 'radar',
    data: {
        labels: ['Passion (Intrinsic)', 'Grades (Extrinsic)', wrapText('Parental Pressure'), wrapText('Career Goals'), 'Curiosity (Intrinsic)'],
        datasets: [{
            label: 'Student Motivation Profile (1-10)',
            data: [8, 7, 6, 9, 8.5],
            fill: true,
            backgroundColor: 'rgba(0, 198, 255, 0.2)',
            borderColor: brilliantBlues.secondary,
            pointBackgroundColor: brilliantBlues.secondary,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: brilliantBlues.secondary
        }]
    },
    options: {
        ...commonChartOptions,
        scales: {
            r: {
                ...commonChartOptions.scales.r,
                min: 0, // Ensure radar chart starts at 0
                max: 10, // Max value for the scale
                ticks: {
                    ...commonChartOptions.scales.r.ticks,
                    stepSize: 2 // Tick every 2 units
                }
            }
        }
    }
});

// Attachment Chart (Pie)
new Chart(document.getElementById('attachmentChart'), {
    type: 'pie',
    data: {
        labels: ['Secure', 'Anxious-Preoccupied', 'Dismissive-Avoidant', 'Fearful-Avoidant'],
        datasets: [{
            label: 'Attachment Style Distribution',
            data: [55, 20, 23, 2], // Hypothetical distribution
            backgroundColor: [brilliantBlues.primary, brilliantBlues.accent, brilliantBlues.secondary, '#E53E3E'], // Red for fearful
            borderColor: '#1a202c',
            borderWidth: 4,
            hoverOffset: 10
        }]
    },
    options: {
        ...commonChartOptions,
        scales: {}, // Pie charts don't use typical scales
        plugins: {
            ...commonChartOptions.plugins,
            tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                    title: tooltipTitleCallback,
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + '%';
                        }
                        return label;
                    }
                }
            }
        }
    }
});

// Therapy Chart (Polar Area)
new Chart(document.getElementById('therapyChart'), {
    type: 'polarArea',
    data: {
        labels: [wrapText('CBT (Thoughts & Behaviors)'), 'DBT (Emotional Skills)', wrapText('Person-Centered (Self-Acceptance)')],
        datasets: [{
            label: 'Therapy Focus Intensity (1-10)',
            data: [8, 9, 7], // Hypothetical intensity
            backgroundColor: [
                'rgba(0, 123, 255, 0.7)',
                'rgba(74, 222, 222, 0.7)',
                'rgba(0, 198, 255, 0.7)'
            ],
            borderColor: '#1a202c',
            borderWidth: 2
        }]
    },
    options: {
        ...commonChartOptions,
        scales: {
            r: {
                ...commonChartOptions.scales.r,
                pointLabels: { font: { size: 10 } },
                min: 0, // Ensure starts at 0
                max: 10, // Max value for the scale
                ticks: {
                    ...commonChartOptions.scales.r.ticks,
                    stepSize: 2 // Tick every 2 units
                }
            }
        },
        plugins: {
            ...commonChartOptions.plugins,
            tooltip: {
                ...commonChartOptions.plugins.tooltip,
                callbacks: {
                    title: tooltipTitleCallback,
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.r !== null) {
                            label += context.parsed.r + '/10';
                        }
                        return label;
                    }
                }
            }
        }
    }
});

// Coping Chart (Bar)
new Chart(document.getElementById('copingChart'), {
    type: 'bar',
    data: {
        labels: [wrapText('Exercise/Mindfulness'), wrapText('Seeking Social Support'), wrapText('Problem Solving'), wrapText('Avoidance/Distraction'), wrapText('Rumination/Worry')],
        datasets: [{
            label: 'Long-Term Effectiveness (1-10)',
            data: [9, 8, 8.5, 3, 2], // Effectiveness ratings
            backgroundColor: [
                brilliantBlues.accent, brilliantBlues.accent, brilliantBlues.accent, // Positive strategies
                '#E53E3E', '#E53E3E' // Maladaptive strategies (red)
            ],
            borderRadius: 4,
        }]
    },
    options: {
        ...commonChartOptions,
        plugins: { ...commonChartOptions.plugins, legend: { display: false } }
    }
});


// --- Interactive Elements & Animations ---

// Smooth scroll to intro on "Explore" button click
document.getElementById('exploreButton').addEventListener('click', () => {
    document.getElementById('mind-bending-facts').scrollIntoView({ // Changed target to new section
        behavior: 'smooth'
    });
});

// Scroll-triggered animations for sections
const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.2 // Trigger when 20% of the element is visible
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// --- Flashcard Logic ---
const flashcardsData = [
    { term: 'Cognitive Dissonance', definition: 'The mental discomfort experienced by a person who simultaneously holds two or more contradictory beliefs, ideas, or values.' },
    { term: 'Confirmation Bias', definition: 'The tendency to search for, interpret, favor, and recall information in a way that confirms one\'s preexisting beliefs or hypotheses.' },
    { term: 'Placebo Effect', definition: 'A phenomenon in which a person experiences a real medical benefit from an inert substance or treatment, due to their belief in its efficacy.' },
    { term: 'Self-Efficacy', definition: 'An individual\'s belief in their capacity to execute behaviors necessary to produce specific performance attainments.' },
    { term: 'Operant Conditioning', definition: 'A learning process through which the strength of a behavior is modified by reinforcement or punishment.' },
    { term: 'Attribution Theory', definition: 'A theory concerning how individuals explain the causes of behavior and events, often distinguishing between internal and external factors.' },
    { term: 'Amygdala', definition: 'An almond-shaped set of neurons located deep in the brain\'s medial temporal lobe, playing a key role in processing emotions, especially fear and anxiety.' },
    { term: 'Growth Mindset', definition: 'The belief that abilities and intelligence can be developed through dedication and hard work, rather than being fixed traits.' },
    { term: 'Schema', definition: 'A cognitive framework or concept that helps organize and interpret information. Schemas can be useful but also contribute to biases.' },
    { term: 'Empathy', definition: 'The ability to understand and share the feelings of another.' },
    { term: 'Priming', definition: 'An implicit memory effect in which exposure to one stimulus influences the response to another stimulus.'},
    { term: 'Mere-Exposure Effect', definition: 'The phenomenon by which people tend to develop a preference for things merely because they are familiar with them.' }
];

let currentFlashcardIndex = 0;
const flashcardContainer = document.getElementById('flashcardContainer');
const nextFlashcardButton = document.getElementById('nextFlashcard');

function createFlashcard(term, definition) {
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard'; // Tailwind classes already in CSS
    flashcard.innerHTML = `
        <div class="flashcard-inner">
            <div class="flashcard-front">
                <p>${term}</p>
            </div>
            <div class="flashcard-back">
                <p>${definition}</p>
            </div>
        </div>
    `;
    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });
    return flashcard;
}

function displayFlashcard(index) {
    flashcardContainer.innerHTML = ''; // Clear previous cards
    const cardData = flashcardsData[index];
    const cardElement = createFlashcard(cardData.term, cardData.definition);
    flashcardContainer.appendChild(cardElement);
}

function showNextFlashcard() {
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardsData.length;
    displayFlashcard(currentFlashcardIndex);
}

// Initial flashcard display
if (flashcardsData.length > 0) {
    displayFlashcard(currentFlashcardIndex);
    nextFlashcardButton.addEventListener('click', showNextFlashcard);
} else {
    nextFlashcardButton.style.display = 'none'; // Hide button if no cards
}

// --- Insight Orb Logic (Replaces Reflection Section) ---
const insights = [
    "The 'Default Mode Network' in your brain is active when you're not focusing on an external task, involved in self-reflection and mind-wandering.",
    "Bystander Effect: The more people present, the less likely any one person is to help in an emergency.",
    "The Stroop Effect demonstrates how automatic processes (like reading) can interfere with task performance (like naming colors).",
    "Cognitive Load Theory suggests our working memory has limited capacity, impacting learning and task execution.",
    "Phantom Limb Pain: The brain can generate pain signals from a limb that no longer exists, highlighting its powerful role in perception.",
    "Misinformation Effect: Post-event information can alter a person's memory of an event.",
    "Pareidolia: The psychological phenomenon where the mind perceives a familiar pattern or image where none exists (e.g., seeing faces in clouds).",
    "The 'Dunning-Kruger Effect' describes how people with low ability at a task overestimate their own ability, and high ability people underestimate theirs.",
    "Synaptic Pruning: Your brain eliminates unused neural connections during development to become more efficient.",
    "The 'Self-Serving Bias' is our tendency to attribute positive events to our own character but negative events to external factors."
];

const insightOrb = document.getElementById('insightOrb');
const orbQuestion = document.getElementById('orbQuestion');
const orbInsight = document.getElementById('orbInsight');
let insightRevealed = false;

insightOrb.addEventListener('click', () => {
    if (!insightRevealed) {
        // First click: reveal insight
        orbQuestion.classList.add('opacity-0');
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * insights.length);
            orbInsight.textContent = insights[randomIndex];
            orbInsight.classList.remove('opacity-0');
            insightRevealed = true;
            orbQuestion.textContent = 'Click again for another insight!'; // Change prompt
            orbQuestion.classList.remove('opacity-0'); // Show prompt again
        }, 500); // Wait for question to fade out
    } else {
        // Subsequent clicks: show new insight
        orbInsight.classList.add('opacity-0');
        orbQuestion.classList.add('opacity-0'); // Fade out previous question/prompt as well
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * insights.length);
            orbInsight.textContent = insights[randomIndex];
            orbInsight.classList.remove('opacity-0');
            orbQuestion.textContent = 'Click again for another insight!'; // Keep the prompt
            orbQuestion.classList.remove('opacity-0');
        }, 500); // Wait for insight to fade out
    }
});

// --- Cognition Compass Logic (Dynamic Version) ---

// 1. Data Structure for the Compass
const cognitionCompassData = {
    "stress": ["Mindfulness", "Time-Blocking", "Journaling", "Meditation"],
    "procrastination": ["Self-Efficacy", "Goal-Setting", "Pomodoro Technique", "Accountability"],
    "anxiety": ["Breathing Exercises", "CBT Techniques", "Grounding", "Mindfulness"],
    "low focus": ["Deep Work", "Pomodoro Technique", "Environmental Design", "Digital Detox"],
    "low motivation": ["Goal-Setting", "Self-Efficacy", "Small Wins", "Values Clarification"],
    "sadness": ["Journaling", "Social Connection", "Self-Care", "Hobbies"],
    "depression": ["Seeking Professional Help", "Self-Care", "Social Connection", "Setting Small Goals"],
    "tension": ["Progressive Muscle Relaxation", "Breathing Exercises", "Mindfulness", "Physical Activity"],
    "negativity": ["Cognitive Restructuring", "Gratitude Journaling", "Positive Affirmations", "Mindfulness"],
    "fear": ["Gradual Exposure", "Grounding", "Self-Compassion", "Visualization"],
    "badvibes": ["Boundary Setting", "Positive Environment", "Mindful Awareness"],
    "overthinking": ["Journaling", "Problem-Solving Focus", "Grounding", "Mindful Awareness"]
};

// 2. DOM Elements
const compassContainer = document.getElementById('compass-container');
const challengeInput = document.getElementById('challenge-input');
const findToolsBtn = document.getElementById('find-tools-btn');
const compassPlaceholder = document.getElementById('compass-placeholder');

// 3. Main Function to Draw the Compass
function drawCompass(challenge) {
    // Clear the container before drawing a new compass
    compassContainer.innerHTML = '';
    compassPlaceholder.style.display = 'none';

    // Get the tools for the given challenge
    const tools = cognitionCompassData[challenge.toLowerCase()];

    if (!tools || tools.length === 0) {
        compassContainer.innerHTML = `<p class="text-xl text-gray-500 p-8">No tools found for that challenge. Try "Stress" or "Anxiety".</p>`;
        return;
    }

    // A. Create the central CHALLENGE node
    const challengeNode = document.createElement('div');
    challengeNode.className = 'compass-node challenge-node';
    challengeNode.textContent = challenge;
    compassContainer.appendChild(challengeNode);

    const numTools = tools.length;
    const radius = Math.min(compassContainer.clientWidth, compassContainer.clientHeight) * 0.35;
    const centerX = compassContainer.clientWidth / 2;
    const centerY = compassContainer.clientHeight / 2;

    // B. Create the TOOL nodes and connecting lines
    tools.forEach((tool, index) => {
        // Calculate position for each tool in a circle
        const angle = (2 * Math.PI / numTools) * index - (Math.PI / 2);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Create the tool node
        const toolNode = document.createElement('div');
        toolNode.className = 'compass-node tool-node';
        toolNode.textContent = tool;
        toolNode.style.top = `${y - toolNode.offsetHeight / 2}px`;
        toolNode.style.left = `${x - toolNode.offsetWidth / 2}px`;
        toolNode.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        compassContainer.appendChild(toolNode);

        // Create the line to connect the challenge and tool
        const line = document.createElement('div');
        line.className = 'compass-line';

        const lineLength = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const lineAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;

        line.style.width = `${lineLength}px`;
        line.style.transform = `rotate(${lineAngle}deg)`;
        line.style.top = `${centerY - 1}px`;
        line.style.left = `${centerX}px`;
        line.style.animationDelay = `${0.2 + (index * 0.1)}s`;

        // Add a click listener to highlight the line and node
        toolNode.addEventListener('click', () => {
            document.querySelectorAll('.compass-line, .tool-node').forEach(el => el.classList.remove('active'));
            line.classList.add('active');
            toolNode.classList.add('active');
        });
        
        compassContainer.appendChild(line);
    });

    // Make sure the central challenge node is visible and on top
    challengeNode.style.opacity = 1;
    challengeNode.style.transform = 'scale(1)';
    challengeNode.style.zIndex = 20;
}

// 4. Event Listener for the button
findToolsBtn.addEventListener('click', (event) => {
    //event.preventDefault(); // Prevents form submission if it's inside a form
    const input = challengeInput.value.trim();
    if (input) {
        drawCompass(input);
    } else {
        compassContainer.innerHTML = `<p class="text-xl text-gray-500 p-8">Please enter a challenge to begin!</p>`;
        compassPlaceholder.style.display = 'none';
    }
});

// 5. Load a default compass on page load to showcase the feature
document.addEventListener('DOMContentLoaded', () => {
    //drawCompass('Stress'); // REMOVED THIS TO SHOW PLACEHOLDER ON LOAD
});

// 6. Optional: Allow pressing Enter key in the input field
challengeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        findToolsBtn.click();
    }
});
// --- Random Insight Generator Logic ---
const psychologicalFacts = [
    {
        icon: 'fas fa-brain',
        title: 'The Dunning-Kruger Effect',
        text: 'The less competent we are, the more we overestimate our abilities. This cognitive bias keeps us from recognizing our own mistakes.'
    },
    {
        icon: 'fas fa-eye-slash',
        title: 'The Spotlight Effect',
        text: 'We often believe others notice our flaws and actions more than they actually do. Most people are too busy thinking about themselves to notice.'
    },
    {
        icon: 'fas fa-cloud',
        title: 'Cognitive Dissonance',
        text: 'The mental discomfort experienced when holding two or more contradictory beliefs, ideas, or values simultaneously.'
    },
    {
        icon: 'fas fa-sync-alt',
        title: 'The Confirmation Bias',
        text: 'The tendency to search for, interpret, favor, and recall information in a way that confirms or supports one\'s pre-existing beliefs.'
    },
    {
        icon: 'fas fa-lock',
        title: 'The Paradox of Choice',
        text: 'Having more choices can lead to increased anxiety and a decrease in satisfaction. Too many options can be overwhelming.'
    },
    {
        icon: 'fas fa-lightbulb',
        title: 'The Framing Effect',
        text: 'Decisions are often influenced by how information is presented, or "framed." The same fact can be perceived differently based on its context.'
    },
    {
        icon: 'fas fa-hourglass-half',
        title: 'The Zeigarnik Effect',
        text: 'Unfinished or interrupted tasks are remembered better than completed ones. This is why cliffhangers and to-do lists are so powerful.'
    },
    {
        icon: 'fas fa-users',
        title: 'The Bystander Effect',
        text: 'Individuals are less likely to offer help to a victim when other people are present. The more bystanders, the less responsibility each feels.'
    }
];

const randomGenerateBtn = document.getElementById('random-generate-btn');
const randomInsightCard = document.getElementById('random-insight-card');
const randomInsightIcon = document.getElementById('random-insight-icon');
const randomInsightTitle = document.getElementById('random-insight-title');
const randomInsightText = document.getElementById('random-insight-text');

// Function to generate and display a single random insight
function generateRandomInsight() {
    // Add fade-out class to start the transition
    randomInsightCard.classList.add('fade-out');

    // Wait for the transition to complete
    setTimeout(() => {
        // Pick a random fact from the array
        const randomIndex = Math.floor(Math.random() * psychologicalFacts.length);
        const newFact = psychologicalFacts[randomIndex];

        // Update the card's content
        randomInsightIcon.className = newFact.icon;
        randomInsightTitle.textContent = newFact.title;
        randomInsightText.textContent = newFact.text;

        // Remove fade-out class to fade it back in
        randomInsightCard.classList.remove('fade-out');
    }, 300); // 300ms matches the CSS transition duration
}

// Event listener for the generate button
randomGenerateBtn.addEventListener('click', generateRandomInsight);

// Generate an insight on initial page load
window.addEventListener('DOMContentLoaded', generateRandomInsight);