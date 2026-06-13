// State Management
let currentUser = localStorage.getItem('mockUser') || null;
let currentChart = null;
let selectedFile = null;

// Evaluation Mock Data Factory
const sampleJobDescription = `We are seeking a Senior Software Engineer with strong experience in Python and Java backend systems. 
The ideal candidate will have hands-on production expertise with React frameworks, building containerized workloads using Docker, and orchestrating secure infrastructure pipelines inside AWS cloud nodes. 
Familiarity with SQL relational schemas and standard UI markup (HTML/CSS) is highly valued.`;

// Mock Storage initialization
let localHistory = JSON.parse(localStorage.getItem('analysisHistory')) || [
    { id: 101, title: "Full Stack Engineer Role", date: "2026-05-12", score: 74 },
    { id: 102, title: "Backend Systems Architect", date: "2026-06-01", score: 89 }
];

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateAuthUI();
    renderHistoryTable();
    setupDragAndDrop();
});

// Theme Management
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Router Control
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(`${pageId}Page`).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Drag & Drop Configuration
function setupDragAndDrop() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const display = document.getElementById('fileNameDisplay');

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.add('border-blue-500', 'bg-blue-50/10');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-blue-500', 'bg-blue-50/10');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        selectedFile = dt.files[0];
        if(selectedFile) display.innerText = selectedFile.name;
    });

    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if(selectedFile) display.innerText = selectedFile.name;
    });
}

function loadSample() {
    document.getElementById('fileNameDisplay').innerText = "sample_engineering_resume.pdf";
    document.getElementById('jobDescriptionInput').value = sampleJobDescription;
    selectedFile = { name: "sample_engineering_resume.pdf" };
}

// Analytics Processing Simulation
function runAnalysis() {
    const jdText = document.getElementById('jobDescriptionInput').value.trim();
    if (!selectedFile || !jdText) {
        alert("Verification failure: Please supply both an target profile document and job parameters description template.");
        return;
    }

    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    btnText.innerText = "Processing Matrix Elements...";
    btnSpinner.classList.remove('hidden');

    setTimeout(() => {
        // Mock Evaluation values mapping to instructions
        const analyticsResult = {
            score: 82,
            foundSkills: ['Java', 'Python', 'HTML', 'CSS', 'SQL'],
            missingSkills: ['React', 'Docker', 'AWS'],
            suggestions: [
                "Add structural measurable execution outcomes (e.g., % metrics or computational speed improvements).",
                "Include relevant architecture certifications (AWS, dynamic engineering targets).",
                "Augment systemic keyword footprint maps directly corresponding to specific target language patterns."
            ]
        };

        // Populate Output UI
        document.getElementById('matchScoreDisplay').innerText = `${analyticsResult.score}%`;
        
        const foundContainer = document.getElementById('skillsFoundContainer');
        foundContainer.innerHTML = analyticsResult.foundSkills.map(s => `<span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('');

        const missingContainer = document.getElementById('skillsMissingContainer');
        missingContainer.innerHTML = analyticsResult.missingSkills.map(s => `<span class="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('');

        const suggestionsContainer = document.getElementById('suggestionsContainer');
        suggestionsContainer.innerHTML = analyticsResult.suggestions.map(s => `<li class="flex items-start text-sm"><i class="fa-solid fa-lightbulb text-amber-500 mt-1 mr-3 flex-shrink-0"></i><span>${s}</span></li>`).join('');

        // Generate Chart Metrics dynamically
        renderChart(analyticsResult.foundSkills.length, analyticsResult.missingSkills.length);

        // Save to History Stack
        localHistory.unshift({
            id: Date.now(),
            title: jdText.substring(0, 30) + "...",
            date: new Date().toISOString().split('T')[0],
            score: analyticsResult.score
        });
        localStorage.setItem('analysisHistory', JSON.stringify(localHistory));
        renderHistoryTable();

        // Standard operational cleanup
        btnText.innerText = "Analyze Match Efficiency";
        btnSpinner.classList.add('hidden');
        showPage('result');

    }, 1500);
}

function renderChart(foundCount, missingCount) {
    const ctx = document.getElementById('skillChart').getContext('2d');
    if (currentChart) currentChart.destroy();

    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Matched Skills', 'Deficit Window'],
            datasets: [{
                data: [foundCount, missingCount],
                backgroundColor: ['#10b981', '#f43f5e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            }
        }
    });
}

// History Handling
function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    if (localHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center p-6 text-gray-400">No telemetry evaluations parsed yet.</td></tr>`;
        return;
    }
    tbody.innerHTML = localHistory.map(item => `
        <tr class="border-b border-gray-100 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="p-4 font-medium truncate max-w-xs">${item.title}</td>
            <td class="p-4 text-gray-500">${item.date}</td>
            <td class="p-4"><span class="font-bold ${item.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}">${item.score}%</span></td>
            <td class="p-4"><button onclick="alert('Reloading analytics tracking parameters for item ID: ${item.id}')" class="text-blue-600 hover:underline">Review</button></td>
        </tr>
    `).join('');
}

// Authentication Simulation Interface
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.toggle('hidden');
}

function handleAuth(e) {
    e.preventDefault();
    currentUser = "Authorized Developer";
    localStorage.setItem('mockUser', currentUser);
    updateAuthUI();
    toggleAuthModal();
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.innerText = "Sign Out";
        authBtn.onclick = () => {
            currentUser = null;
            localStorage.removeItem('mockUser');
            updateAuthUI();
        };
    } else {
        authBtn.innerText = "Sign In";
        authBtn.onclick = toggleAuthModal;
    }
}

// PDF Export Module
function downloadReport() {
    const element = document.getElementById('pdfContainer');
    const opt = {
        margin:       10,
        filename:     'ApexAnalyze_Match_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}