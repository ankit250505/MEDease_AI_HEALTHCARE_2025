// healthcare.js - Healthcare Management System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const specialistsTab = document.getElementById('specialistsTab');
    const hospitalsTab = document.getElementById('hospitalsTab');
    const specialistsSection = document.getElementById('specialistsSection');
    const hospitalsSection = document.getElementById('hospitalsSection');

    specialistsTab.addEventListener('click', function() {
        showSpecialists();
    });

    hospitalsTab.addEventListener('click', function() {
        showHospitals();
    });

    function showSpecialists() {
        specialistsTab.classList.add('filter-active');
        hospitalsTab.classList.remove('filter-active');
        hospitalsTab.classList.add('text-white/80', 'hover:text-white', 'hover:bg-white/10');
        
        specialistsSection.classList.remove('hidden');
        hospitalsSection.classList.add('hidden');
    }

    function showHospitals() {
        hospitalsTab.classList.add('filter-active');
        specialistsTab.classList.remove('filter-active');
        specialistsTab.classList.add('text-white/80', 'hover:text-white', 'hover:bg-white/10');
        
        hospitalsSection.classList.remove('hidden');
        specialistsSection.classList.add('hidden');
    }

    // Bed booking functionality
    let selectedBed = null;
    let selectedWard = null;
    let currentHospital = null;

    // Ward configurations with bed layouts
    const wardConfigurations = {
        general: {
            name: 'General Ward',
            price: 150,
            totalBeds: 32,
            occupiedBeds: [2, 5, 8, 12, 15, 18, 23, 27], // Mock occupied beds
            maintenanceBeds: [10, 20], // Mock maintenance beds
            layout: 'standard'
        },
        icu: {
            name: 'ICU',
            price: 500,
            totalBeds: 16,
            occupiedBeds: [3, 7, 11, 14, 16], // Mock occupied beds
            maintenanceBeds: [5, 9], // Mock maintenance beds
            layout: 'icu'
        },
        private: {
            name: 'Private Room',
            price: 300,
            totalBeds: 12,
            occupiedBeds: [4, 8, 11], // Mock occupied beds
            maintenanceBeds: [6], // Mock maintenance beds
            layout: 'private'
        },
        emergency: {
            name: 'Emergency',
            price: 200,
            totalBeds: 8,
            occupiedBeds: [2, 6], // Mock occupied beds
            maintenanceBeds: [4], // Mock maintenance beds
            layout: 'emergency'
        }
    };

    // Ward type selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.ward-type')) {
            const wardButton = e.target.closest('.ward-type');
            const wardType = wardButton.dataset.ward;
            
            // Update selection
            document.querySelectorAll('.ward-type').forEach(btn => {
                btn.classList.remove('border-blue-400', 'bg-blue-500/20');
                btn.classList.add('border-white/20');
            });
            
            wardButton.classList.remove('border-white/20');
            wardButton.classList.add('border-blue-400', 'bg-blue-500/20');
            
            selectedWard = wardType;
            generateBedLayout(wardType);
        }
    });

    function generateBedLayout(wardType) {
        const config = wardConfigurations[wardType];
        const bedGrid = document.getElementById('bedGrid');
        
        bedGrid.innerHTML = '';
        
        for (let i = 1; i <= config.totalBeds; i++) {
            const bedElement = document.createElement('div');
            bedElement.className = 'bed-seat';
            
            // Determine bed status
            let bedClass = 'bed-available';
            let clickable = true;
            
            if (config.occupiedBeds.includes(i)) {
                bedClass = 'bed-occupied';
                clickable = false;
            } else if (config.maintenanceBeds.includes(i)) {
                bedClass = 'bed-maintenance';
                clickable = false;
            }
            
            bedElement.classList.add(bedClass);
            bedElement.innerHTML = `<div class="bed-number">${i}</div>`;
            bedElement.dataset.bedNumber = i;
            
            if (clickable) {
                bedElement.addEventListener('click', function() {
                    selectBed(i, wardType);
                });
            }
            
            bedGrid.appendChild(bedElement);
        }
    }

    function selectBed(bedNumber, wardType) {
        // Clear previous selection
        document.querySelectorAll('.bed-seat').forEach(bed => {
            bed.classList.remove('bed-selected');
        });
        
        // Select new bed
        const bedElement = document.querySelector(`[data-bed-number="${bedNumber}"]`);
        bedElement.classList.remove('bed-available');
        bedElement.classList.add('bed-selected');
        
        selectedBed = bedNumber;
        updateBedDetails(bedNumber, wardType);
    }

    function updateBedDetails(bedNumber, wardType) {
        const config = wardConfigurations[wardType];
        const detailsDiv = document.getElementById('selectedBedDetails');
        
        document.getElementById('selectedBedNumber').textContent = `${wardType.toUpperCase()}-${bedNumber}`;
        document.getElementById('selectedWardType').textContent = config.name;
        document.getElementById('selectedBedPrice').textContent = `$${config.price}/day`;
        
        detailsDiv.classList.remove('hidden');
        
        // Update booking summary
        const bookingSummary = document.getElementById('bookingSummary');
        bookingSummary.textContent = `Bed ${wardType.toUpperCase()}-${bedNumber} - $${config.price}/day`;
        
        // Enable confirm button
        document.getElementById('confirmBooking').disabled = false;
    }

    // Global functions
    window.viewSpecialistDetails = function(specialistId) {
        showNotification('Specialist profile will be displayed here', 'info');
    };

    window.bookAppointment = function(specialistId) {
        showNotification('Appointment booking form will open here', 'success');
    };

    window.viewHospitalDetails = function(hospitalId) {
        showNotification('Hospital details will be displayed here', 'info');
    };

    window.bookBed = function(hospitalId) {
        currentHospital = hospitalId;
        const modal = document.getElementById('bedBookingModal');
        const title = document.getElementById('bedModalTitle');
        
        const hospitalNames = {
            'city-general': 'City General Hospital',
            'medcare-urgent': 'MedCare Urgent Care'
        };
        
        title.textContent = `Book Bed - ${hospitalNames[hospitalId] || 'Hospital'}`;
        
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        selectedBed = null;
        selectedWard = null;
        document.getElementById('selectedBedDetails').classList.add('hidden');
        document.getElementById('confirmBooking').disabled = true;
        document.getElementById('bookingSummary').textContent = 'Select a bed to see pricing';
    };

    window.closeBedModal = function() {
        const modal = document.getElementById('bedBookingModal');
        modal.classList.add('opacity-0', 'invisible');
        modal.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = 'auto';
    };

    window.confirmBedBooking = function() {
        if (!selectedBed || !selectedWard) {
            showNotification('Please select a bed first', 'error');
            return;
        }
        
        // Show loading state
        const confirmBtn = document.getElementById('confirmBooking');
        const originalText = confirmBtn.textContent;
        confirmBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';
        
        // Simulate API call
        setTimeout(() => {
            confirmBtn.textContent = originalText;
            closeBedModal();
            showNotification('Bed booking confirmed! You will receive a confirmation SMS shortly.', 'success');
            
            // Show booking confirmation modal
            showBookingConfirmation();
        }, 2000);
    };

    function showBookingConfirmation() {
        const config = wardConfigurations[selectedWard];
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6';
        
        confirmationModal.innerHTML = `
            <div class="bg-black/95 border border-green-500/50 rounded-2xl max-w-md w-full p-8 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p class="text-neutral-300 mb-4">Your bed has been successfully reserved.</p>
                <div class="bg-white/10 rounded-xl p-4 mb-6 text-left">
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-neutral-400">Bed Number:</span>
                            <span class="text-white">${selectedWard.toUpperCase()}-${selectedBed}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-neutral-400">Ward:</span>
                            <span class="text-white">${config.name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-neutral-400">Rate:</span>
                            <span class="text-white">$${config.price}/day</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-neutral-400">Booking ID:</span>
                            <span class="text-green-400">ME-${Date.now().toString().slice(-6)}</span>
                        </div>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(confirmationModal);
        document.body.style.overflow = 'hidden';
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
});

// Chatbot knowledge base
const chatbotResponses = {
    // Symptom Checker Related
    'symptom checker': {
        response: "The Symptom Checker is easy to use! Click 'Start Check' on your dashboard, then follow these steps:\n\n1. Select your symptoms from the list\n2. Indicate when symptoms started\n3. Rate severity (1-10)\n4. Provide additional information\n5. Get your AI-powered health assessment\n\nWould you like me to open the symptom checker for you?",
        actions: ['Start Symptom Checker']
    },
    'how to use symptom checker': {
        response: "Here's how to use the Symptom Checker:\n\n✅ Click the 'Start Check' button on your dashboard\n✅ Select all symptoms you're experiencing\n✅ Choose when symptoms began\n✅ Rate severity from 1 (mild) to 10 (severe)\n✅ Answer additional questions about medications and travel\n✅ Review your personalized health assessment\n\nThe whole process takes about 2 minutes!",
        actions: ['Start Symptom Checker']
    },
    
    // Report Upload Related
    'upload reports': {
        response: "Uploading medical reports is simple:\n\n1. Click 'Upload' on your dashboard\n2. Drag & drop files or click 'Choose Files'\n3. Select report type (Blood Test, Imaging, etc.)\n4. Click 'Analyze Reports' for AI insights\n\n📋 Supported formats: PDF, JPG, PNG, DICOM\n📊 Get instant analysis and recommendations!",
        actions: ['Open Report Upload']
    },
    'medical reports': {
        response: "You can upload various medical reports:\n\n🩸 Blood Test Reports\n🔬 Lab Results\n📷 X-rays & Scans (DICOM)\n💊 Prescriptions\n📝 Doctor Notes\n\nOur AI analyzes your reports and provides:\n• Risk assessments\n• Normal/abnormal ranges\n• Next step recommendations\n• Specialist suggestions",
        actions: ['Open Report Upload']
    },
    
    // Doctor & Healthcare Related
    'doctors': {
        response: "Finding nearby doctors is easy with Med Ease:\n\n👨‍⚕️ Browse specialists by category\n📍 View distance and ratings\n⏰ Check real-time availability\n💳 See consultation fees\n🏥 Find nearby hospitals\n\nWould you like to explore our healthcare network?",
        actions: ['Find Doctors']
    },
    'nearby doctors': {
        response: "Our Healthcare Network shows you:\n\n🔍 Specialists within 25 miles\n⭐ Ratings and reviews\n💰 Consultation fees\n📅 Next available appointments\n🏥 Hospital bed availability\n🚑 Emergency services\n\nI can help you find the right healthcare provider!",
        actions: ['Find Doctors']
    },
    
    // Dashboard Navigation
    'dashboard': {
        response: "Your Med Ease Dashboard includes:\n\n🏠 Health Overview\n📊 Recent Activity\n⚕️ Medical Alerts (Allergies & Conditions)\n📋 Quick Access Menu\n👤 Profile Information\n\nEverything is designed to give you a complete view of your health status!",
        actions: []
    },
    'medical history': {
        response: "Your Medical History contains:\n\n📑 Past symptom assessments\n🔬 Uploaded lab reports\n💊 Current medications\n🚨 Allergy information\n📈 Health trends over time\n\nYou can access it from the sidebar under 'Quick Access'.",
        actions: []
    },
    
    // Emergency & Support
    'emergency': {
        response: "🚨 For Medical Emergencies:\n\n❗ Call 911 immediately\n🏥 Use Emergency button on dashboard\n📞 Contact: +1 (555) MEDEASE\n\n⚠️ Med Ease is NOT for emergency situations. Always call emergency services for urgent medical needs.\n\nFor non-urgent questions, I'm here to help!",
        actions: []
    },
    'help': {
        response: "I'm here to help you navigate Med Ease! I can assist with:\n\n✅ Using the Symptom Checker\n✅ Uploading medical reports\n✅ Finding doctors and specialists\n✅ Understanding your dashboard\n✅ Navigating features\n\nWhat specific help do you need today?",
        actions: []
    },
    
    // Privacy & Security
    'privacy': {
        response: "Your privacy is our priority! 🔒\n\n✅ HIPAA-compliant data protection\n✅ End-to-end encryption\n✅ Secure cloud storage\n✅ No data sharing without consent\n✅ Regular security audits\n\nYour health information is completely secure with Med Ease.",
        actions: []
    },
    
    // Default responses
    'default': {
        response: "I'm here to help you with Med Ease! I can answer questions about:\n\n• Using the Symptom Checker\n• Uploading medical reports\n• Finding doctors and specialists\n• Navigating your dashboard\n• Privacy and security\n\nWhat would you like to know?",
        actions: []
    }
};

// Global chatbot state
let isChatbotOpen = false;

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chatToggle');
    const chatInput = document.getElementById('chatInput');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChatbot);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Auto-show chatbot after 5 seconds if first visit
    setTimeout(() => {
        if (!localStorage.getItem('medease-chatbot-seen')) {
            showChatbotHint();
            localStorage.setItem('medease-chatbot-seen', 'true');
        }
    }, 5000);
});

function toggleChatbot() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chatIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    if (!chatWindow || !chatIcon || !closeIcon) return;
    
    if (isChatbotOpen) {
        // Close chatbot
        chatWindow.classList.add('opacity-0', 'invisible', 'scale-95');
        chatWindow.classList.remove('opacity-100', 'visible', 'scale-100');
        chatIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        isChatbotOpen = false;
    } else {
        // Open chatbot
        chatWindow.classList.remove('opacity-0', 'invisible', 'scale-95');
        chatWindow.classList.add('opacity-100', 'visible', 'scale-100');
        chatIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        isChatbotOpen = true;
        
        // Focus input
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.focus();
        }, 300);
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    setTimeout(() => {
        hideTypingIndicator();
        const response = processMessage(message);
        addMessage(response.response, 'bot', response.actions);
    }, 1500);
}

function askQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = question;
        sendMessage();
    }
}

function addMessage(message, sender, actions = []) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex space-x-3 message-fade-in ${sender === 'user' ? 'justify-end' : ''}`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="bg-blue-600 rounded-2xl rounded-tr-none p-3 max-w-xs">
                <p class="text-white text-sm">${message}</p>
            </div>
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-xs">JS</span>
            </div>
        `;
    } else {
        let actionsHtml = '';
        if (actions && actions.length > 0) {
            actionsHtml = `
                <div class="mt-3 space-y-2">
                    ${actions.map(action => `
                        <button onclick="handleAction('${action}')" class="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs transition">
                            ${action}
                        </button>
                    `).join('')}
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-xs">✚</span>
            </div>
            <div class="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-xs">
                <p class="text-white text-sm whitespace-pre-line">${message}</p>
                ${actionsHtml}
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Hide suggested questions after first interaction
    if (sender === 'user') {
        const suggestedQuestions = document.getElementById('suggestedQuestions');
        if (suggestedQuestions) {
            suggestedQuestions.style.display = 'none';
        }
    }
}

function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(chatbotResponses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Check for keyword matches
    if (lowerMessage.includes('symptom') || lowerMessage.includes('check')) {
        return chatbotResponses['symptom checker'];
    }
    
    if (lowerMessage.includes('upload') || lowerMessage.includes('report')) {
        return chatbotResponses['upload reports'];
    }
    
    if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
        return chatbotResponses['doctors'];
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
        return chatbotResponses['emergency'];
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
        return chatbotResponses['help'];
    }
    
    if (lowerMessage.includes('privacy') || lowerMessage.includes('security')) {
        return chatbotResponses['privacy'];
    }
    
    // Default response
    return chatbotResponses['default'];
}

function handleAction(action) {
    switch(action) {
        case 'Start Symptom Checker':
            if (typeof startSymptomChecker === 'function') {
                startSymptomChecker();
                toggleChatbot(); // Close chatbot
            }
            break;
        case 'Open Report Upload':
            if (typeof startReportUpload === 'function') {
                startReportUpload();
                toggleChatbot(); // Close chatbot
            }
            break;
        case 'Find Doctors':
            window.open('healthcare.html', '_blank');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'flex space-x-3 message-fade-in';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-xs">✚</span>
        </div>
        <div class="bg-white/10 rounded-2xl rounded-tl-none p-3">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-white rounded-full chatbot-typing"></div>
                <div class="w-2 h-2 bg-white rounded-full chatbot-typing" style="animation-delay: 0.2s;"></div>
                <div class="w-2 h-2 bg-white rounded-full chatbot-typing" style="animation-delay: 0.4s;"></div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function showChatbotHint() {
    const chatToggle = document.getElementById('chatToggle');
    if (!chatToggle) return;
    
    // Add pulsing effect
    chatToggle.style.animation = 'pulse 2s infinite';
    
    // Remove effect after 10 seconds
    setTimeout(() => {
        chatToggle.style.animation = '';
    }, 10000);
}

// Export functions for external use
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.askQuestion = askQuestion;
window.handleAction = handleAction;

if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'js/chatbot.js';
    document.head.appendChild(script);
}