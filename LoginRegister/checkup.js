// checkup.js - Med Ease Dashboard JavaScript

// Global variables - moved outside DOMContentLoaded to be accessible by global functions
let currentStep = 1;
const totalSteps = 4;
let symptomData = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkup dashboard loaded'); // Debug log
    
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = currentDate;
    }

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
        });
    }

    // User menu functionality
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = !userMenu.classList.contains('opacity-0');
            
            if (isVisible) {
                closeUserMenu();
            } else {
                openUserMenu();
            }
        });

        document.addEventListener('click', function(e) {
            if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                closeUserMenu();
            }
        });
    }

    function openUserMenu() {
        userMenu.classList.remove('opacity-0', 'invisible', 'translate-y-2');
        userMenu.classList.add('opacity-100', 'visible', 'translate-y-0');
    }

    function closeUserMenu() {
        userMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
        userMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }

    // Severity range functionality
    const severityRange = document.getElementById('severityRange');
    const severityValue = document.getElementById('severityValue');

    if (severityRange && severityValue) {
        severityRange.addEventListener('input', function() {
            const value = parseInt(this.value);
            let severity = '';
            
            if (value <= 3) severity = `${value} - Mild`;
            else if (value <= 6) severity = `${value} - Moderate`;
            else severity = `${value} - Severe`;
            
            severityValue.textContent = severity;
        });
    }

    // File upload functionality
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const fileCount = document.getElementById('fileCount');
    const analyzeBtn = document.getElementById('analyzeBtn');
    let selectedFiles = [];

    // Drag and drop functionality
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            uploadArea.classList.add('drag-over');
        }

        function unhighlight() {
            uploadArea.classList.remove('drag-over');
        }

        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
    }

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });
    }

    function handleFiles(files) {
        ([...files]).forEach(addFile);
        updateFileCount();
    }

    function addFile(file) {
        selectedFiles.push(file);
        displayFile(file);
    }

    function displayFile(file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'flex items-center space-x-3';
        
        const icon = getFileIcon(file.type);
        const fileName = document.createElement('span');
        fileName.className = 'text-white font-medium';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'text-neutral-400 text-sm';
        fileSize.textContent = formatFileSize(file.size);
        
        fileInfo.appendChild(icon);
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-red-400 hover:text-red-300 transition';
        removeBtn.innerHTML = '✕';
        removeBtn.onclick = () => removeFile(file, fileDiv);
        
        fileDiv.appendChild(fileInfo);
        fileDiv.appendChild(removeBtn);
        
        uploadedFiles.appendChild(fileDiv);
    }

    function removeFile(file, element) {
        selectedFiles = selectedFiles.filter(f => f !== file);
        element.remove();
        updateFileCount();
    }

    function updateFileCount() {
        const count = selectedFiles.length;
        if (fileCount) {
            fileCount.textContent = count === 0 ? 'No files selected' : `${count} file${count > 1 ? 's' : ''} selected`;
        }
        if (analyzeBtn) {
            analyzeBtn.disabled = count === 0;
        }
    }

    function getFileIcon(fileType) {
        const icon = document.createElement('div');
        icon.className = 'w-8 h-8 rounded-lg flex items-center justify-center';
        
        if (fileType.includes('pdf')) {
            icon.className += ' bg-red-500/20';
            icon.innerHTML = '<span class="text-red-400 text-xs font-bold">PDF</span>';
        } else if (fileType.includes('image')) {
            icon.className += ' bg-blue-500/20';
            icon.innerHTML = '<span class="text-blue-400 text-xs font-bold">IMG</span>';
        } else {
            icon.className += ' bg-green-500/20';
            icon.innerHTML = '<span class="text-green-400 text-xs font-bold">DOC</span>';
        }
        
        return icon;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Initialize the first step when the page loads
    updateStepDisplay();
});

// Modal functions - Global scope
function startSymptomChecker() {
    console.log('Starting symptom checker'); // Debug log
    const modal = document.getElementById('symptomModal');
    if (modal) {
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
        
        // Reset to step 1 and update display
        currentStep = 1;
        updateStepDisplay();
    } else {
        console.error('Symptom modal not found!');
    }
}

function closeSymptomModal() {
    const modal = document.getElementById('symptomModal');
    if (modal) {
        modal.classList.add('opacity-0', 'invisible');
        modal.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = 'auto';
        
        // Reset form
        currentStep = 1;
        updateStepDisplay();
    }
}

function startReportUpload() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.add('opacity-0', 'invisible');
        modal.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = 'auto';
    }
}

// Symptom checker step management - Global scope
function nextStep() {
    console.log(`Moving from step ${currentStep} to step ${currentStep + 1}`); // Debug log
    
    // Validation for step 1 - check if at least one symptom is selected
    if (currentStep === 1) {
        const selectedSymptoms = document.querySelectorAll('input[name="symptoms"]:checked');
        if (selectedSymptoms.length === 0) {
            showNotification('Please select at least one symptom to continue', 'error');
            return;
        }
    }
    
    // Validation for step 2 - check if onset is selected
    if (currentStep === 2) {
        const selectedOnset = document.querySelector('input[name="onset"]:checked');
        if (!selectedOnset) {
            showNotification('Please select when your symptoms started', 'error');
            return;
        }
    }
    
    if (currentStep < 4) {
        if (currentStep === 3) {
            // Generate results before showing step 4
            generateSymptomResults();
        }
        currentStep++;
        updateStepDisplay();
    } else {
        // Complete assessment
        closeSymptomModal();
        showNotification('Health assessment completed! Check your dashboard for results.', 'success');
    }
}

function previousStep() {
    console.log(`Moving back from step ${currentStep} to step ${currentStep - 1}`); // Debug log
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    console.log(`Updating display for step ${currentStep}`); // Debug log
    
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.add('hidden');
        }
    }
    
    // Show current step
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (currentStepEl) {
        currentStepEl.classList.remove('hidden');
        console.log(`Showing step ${currentStep}`); // Debug log
    } else {
        console.error(`Step ${currentStep} element not found!`);
    }
    
    // Update progress
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (progressBar) {
        const progress = (currentStep / 4) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Step ${currentStep} of 4`;
    }
    
    if (prevBtn) {
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
    }
    
    if (nextBtn) {
        if (currentStep === 4) {
            nextBtn.textContent = 'Complete Assessment';
        } else {
            nextBtn.textContent = 'Next';
        }
    }
}

function generateSymptomResults() {
    console.log('Generating symptom results'); // Debug log
    const resultsDiv = document.getElementById('symptomResults');
    if (!resultsDiv) {
        console.error('Results div not found!');
        return;
    }
    
    // Get selected symptoms
    const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(cb => cb.value);
    
    console.log('Selected symptoms:', selectedSymptoms); // Debug log
    
    // Mock analysis based on selected symptoms
    let diagnosis = [];
    let specialists = [];
    let riskLevel = 'Low';
    
    if (selectedSymptoms.includes('headache') || selectedSymptoms.includes('fever')) {
        diagnosis.push('Common viral infection', 'Tension headache', 'Migraine');
        specialists.push('General Practitioner', 'Neurologist');
        riskLevel = 'Low to Moderate';
    }
    
    if (selectedSymptoms.includes('chest_pain')) {
        diagnosis.push('Muscle strain', 'Anxiety', 'Cardiac assessment needed');
        specialists.push('Cardiologist', 'Emergency Medicine');
        riskLevel = 'Moderate';
    }
    
    if (selectedSymptoms.includes('cough') && selectedSymptoms.includes('fever')) {
        diagnosis.push('Upper respiratory infection', 'Pneumonia (possible)', 'COVID-19 (possible)');
        specialists.push('Pulmonologist', 'Internal Medicine');
        riskLevel = 'Moderate';
    }
    
    // Default fallback
    if (diagnosis.length === 0) {
        diagnosis = ['General health assessment needed', 'Routine checkup recommended'];
        specialists = ['General Practitioner'];
    }
    
    const resultsHTML = `
        <div class="space-y-6">
            <!-- Risk Level -->
            <div class="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                <div class="flex items-center space-x-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="font-semibold text-yellow-400">Risk Level: ${riskLevel}</span>
                </div>
            </div>
            
            <!-- Preliminary Diagnosis -->
            <div class="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <h4 class="font-semibold text-blue-400 mb-3">Possible Conditions</h4>
                <ul class="space-y-2">
                    ${diagnosis.map(d => `<li class="flex items-center space-x-2"><span class="w-2 h-2 bg-blue-400 rounded-full"></span><span class="text-white">${d}</span></li>`).join('')}
                </ul>
            </div>
            
            <!-- Recommended Specialists -->
            <div class="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <h4 class="font-semibold text-green-400 mb-3">Recommended Specialists</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${specialists.map(s => `
                        <div class="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                            <span class="text-white">${s}</span>
                            <button onclick="window.open('healthcare.html', '_blank')" class="text-green-400 hover:text-green-300 text-sm">Find →</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Nearby Healthcare -->
            <div class="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                <h4 class="font-semibold text-purple-400 mb-3">Nearby Healthcare Providers</h4>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                            <p class="text-white font-medium">City General Hospital</p>
                            <p class="text-neutral-400 text-sm">2.3 miles away • 4.8★</p>
                        </div>
                        <button onclick="window.open('/healthcare.html', '_blank')" class="text-purple-400 hover:text-purple-300 text-sm">View →</button>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                            <p class="text-white font-medium">MedCare Urgent Care</p>
                            <p class="text-neutral-400 text-sm">1.8 miles away • 4.6★</p>
                        </div>
                        <button onclick="window.open('/healthcare.html', '_blank')" class="text-purple-400 hover:text-purple-300 text-sm">View →</button>
                    </div>
                </div>
            </div>
            
            <!-- Disclaimer -->
            <div class="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p class="text-red-300 text-sm">
                    <strong>Important:</strong> This assessment is for informational purposes only. 
                    Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = resultsHTML;
    console.log('Results generated successfully'); // Debug log
}

function analyzeReports() {
    const analysisDiv = document.getElementById('reportAnalysis');
    const analysisContent = document.getElementById('analysisContent');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (!analysisDiv || !analysisContent) return;
    
    // Show loading state
    analyzeBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">ircle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"r" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...';
    
    // Simulate analysis
    setTimeout(() => {
        const reportType = document.querySelector('input[name="reportType"]:checked')?.value || 'general';
        
        let analysisHTML = '';
        
        if (reportType === 'blood_test') {
            analysisHTML = `
                <div class="space-y-4">
                    <div class="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                        <h4 class="font-semibold text-green-400 mb-2">Overall Status: Normal Range</h4>
                        <p class="text-green-300 text-sm">Most values within acceptable limits</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-3 bg-white/10 rounded-lg">
                            <p class="text-white font-medium">Glucose</p>
                            <p class="text-green-400 text-sm">92 mg/dL (Normal: 70-100)</p>
                        </div>
                        <div class="p-3 bg-white/10 rounded-lg">
                            <p class="text-white font-medium">Cholesterol</p>
                            <p class="text-yellow-400 text-sm">205 mg/dL (Borderline: 200-239)</p>
                        </div>
                        <div class="p-3 bg-white/10 rounded-lg">
                            <p class="text-white font-medium">Hemoglobin</p>
                            <p class="text-green-400 text-sm">14.2 g/dL (Normal: 12-16)</p>
                        </div>
                        <div class="p-3 bg-white/10 rounded-lg">
                            <p class="text-white font-medium">White Blood Cells</p>
                            <p class="text-green-400 text-sm">6,500 /μL (Normal: 4,000-11,000)</p>
                        </div>
                    </div>
                    <div class="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                        <h4 class="font-semibold text-blue-400 mb-2">Recommendations</h4>
                        <ul class="space-y-1 text-blue-300 text-sm">
                            <li>• Monitor cholesterol levels - consider dietary adjustments</li>
                            <li>• Follow up with primary care physician in 3 months</li>
                            <li>• Continue current lifestyle and medications</li>
                        </ul>
                    </div>
                    <div class="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                        <h4 class="font-semibold text-purple-400 mb-2">Suggested Specialists</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 bg-white/10 rounded-full text-sm text-white">Cardiologist</span>
                            <span class="px-3 py-1 bg-white/10 rounded-full text-sm text-white">Endocrinologist</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (reportType === 'imaging') {
            analysisHTML = `
                <div class="space-y-4">
                    <div class="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                        <h4 class="font-semibold text-green-400 mb-2">Imaging Analysis: No Acute Findings</h4>
                        <p class="text-green-300 text-sm">Structure appears normal with no immediate concerns</p>
                    </div>
                    <div class="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                        <h4 class="font-semibold text-blue-400 mb-2">Key Observations</h4>
                        <ul class="space-y-1 text-blue-300 text-sm">
                            <li>• Normal bone density and structure</li>
                            <li>• No signs of inflammation or abnormal masses</li>
                            <li>• Recommend follow-up if symptoms persist</li>
                        </ul>
                    </div>
                    <div class="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                        <h4 class="font-semibold text-purple-400 mb-2">Next Steps</h4>
                        <p class="text-purple-300 text-sm">Consult with radiologist for detailed interpretation</p>
                    </div>
                </div>
            `;
        } else {
            analysisHTML = `
                <div class="space-y-4">
                    <div class="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                        <h4 class="font-semibold text-blue-400 mb-2">Report Processed Successfully</h4>
                        <p class="text-blue-300 text-sm">Document has been analyzed and added to your medical history</p>
                    </div>
                    <div class="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                        <h4 class="font-semibold text-green-400 mb-2">Recommended Actions</h4>
                        <ul class="space-y-1 text-green-300 text-sm">
                            <li>• Share with your primary care physician</li>
                            <li>• Schedule follow-up appointment if needed</li>
                            <li>• Monitor symptoms and report changes</li>
                        </ul>
                    </div>
                </div>
            `;
        }
        
        analysisContent.innerHTML = analysisHTML;
        analysisDiv.classList.remove('hidden');
        
        analyzeBtn.innerHTML = 'Analysis Complete';
        analyzeBtn.disabled = true;
        
        showNotification('Report analysis completed successfully!', 'success');
    }, 3000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
