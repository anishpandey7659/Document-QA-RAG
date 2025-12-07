let uploadedDocument = null;
let documentContent = '';

// NEW (use this):
const API_URL = 'http://localhost:8000/summarize_uploaded_document/';
const uploadSection = document.getElementById('uploadSection');
const workspaceSection = document.getElementById('workspaceSection');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const chatContainer = document.getElementById('chatContainer');
const questionInput = document.getElementById('questionInput');
const sendQuestion = document.getElementById('sendQuestion');

 // Upload Area Click
uploadArea.addEventListener('click', () => fileInput.click());
// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
            uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
            handleFileUpload(files[0]);
        }
});

// File Input Change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
});

// Handle File Upload
function handleFileUpload(file) {
        uploadedDocument = file;
            
        // Show loading overlay
        showLoadingAnimation(file);
}

        // Show Loading Animation
        function showLoadingAnimation(file) {
            const loadingOverlay = document.getElementById('loadingOverlay');
            const loadingStep = document.getElementById('loadingStep');
            const stepIndicator = document.getElementById('stepIndicator');
            const progressBar = document.getElementById('progressBar');
            
            loadingOverlay.classList.add('active');
            
            const steps = [
                { text: 'Uploading file...', progress: 25 },
                { text: 'Analyzing document structure...', progress: 50 },
                { text: 'Extracting content...', progress: 75 },
                { text: 'Preparing workspace...', progress: 100 }
            ];
            
            let currentStep = 0;
            
            const stepInterval = setInterval(() => {
                if (currentStep < steps.length) {
                    loadingStep.textContent = steps[currentStep].text;
                    progressBar.style.width = steps[currentStep].progress + '%';
                    stepIndicator.textContent = `Step ${currentStep + 1} of ${steps.length}`;
                    currentStep++;
                } else {
                    clearInterval(stepInterval);
                    
                    // Process the file
                    setTimeout(() => {
                        processDocument(file);
                        loadingOverlay.classList.remove('active');
                        
                        // Reset for next time
                        setTimeout(() => {
                            progressBar.style.width = '0%';
                            loadingStep.textContent = 'Uploading file...';
                            stepIndicator.textContent = 'Step 1 of 4';
                        }, 500);
                    }, 500);
                }
            }, 800);
        }

        // Process Document
        function processDocument(file) {
            // Update file info
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            document.getElementById('documentTitle').textContent = file.name;

            // Read file content
            const reader = new FileReader();
            reader.onload = (e) => {
                documentContent = e.target.result;
                displayDocument(documentContent, file.type);
                
                // Show workspace
                uploadSection.classList.add('hidden');
                workspaceSection.classList.remove('hidden');
                
                // Welcome message
                addMessage('ai', `Great! I've loaded "${file.name}". How can I help you understand this document?`);
            };
            
            if (file.type === 'text/plain') {
                reader.readAsText(file);
            } else {
                reader.readAsText(file); // For demo purposes
                documentContent = `This is a preview of ${file.name}. In a production environment, this would show the actual document content with proper parsing for PDF, DOC, and other formats.`;
                displayDocument(documentContent, file.type);
                
                // Show workspace
                uploadSection.classList.add('hidden');
                workspaceSection.classList.remove('hidden');
                
                // Welcome message
                addMessage('ai', `Great! I've loaded "${file.name}". How can I help you understand this document?`);
            }
        }

        // Display Document
        // function displayDocument(content, type) {
        //     const docContent = document.getElementById('documentContent');
        //     docContent.innerHTML = `<div class="prose max-w-none"><pre class="whitespace-pre-wrap text-gray-700">${escapeHtml(content)}</pre></div>`;
        // }
        function displayDocument(content, type) {
            const pdfViewer = document.getElementById('pdfViewer');

                if (type === 'application/pdf') {
                    // Use Object URL to display PDF in iframe
                    const fileURL = URL.createObjectURL(uploadedDocument);
                    pdfViewer.src = fileURL;
                } else {
                // For text, show in HTML
                    pdfViewer.srcdoc = `<pre style="white-space: pre-wrap; font-family: sans-serif; padding: 10px;">${escapeHtml(content)}</pre>`;
            }
        }


        // Close Document
        document.getElementById('closeDocument').addEventListener('click', () => {
            workspaceSection.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            uploadedDocument = null;
            documentContent = '';
            chatContainer.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    <i class="fas fa-robot text-5xl mb-3"></i>
                    <p>Start asking questions about your document!</p>
                </div>
            `;
        });

        // Summarize Button
        // Summarize Button
        document.getElementById('summarizeBtn').addEventListener('click', () => {
            const summaryQuestion = 'Generate a clear, detailed, and complete summary of this document.';
            addMessage('user', summaryQuestion);
            callApiWithQuestion(summaryQuestion);
        });

        // Key Points Button
        // Key Points Button
        document.getElementById('keyPointsBtn').addEventListener('click', () => {
            const keyPointsQuestion = 'What are the main 5 key points and conclusions of the document? List them.';
            addMessage('user', keyPointsQuestion);
            callApiWithQuestion(keyPointsQuestion);
        });
        // Send Question
        // ... existing code in sendQuestionHandler()

        function sendQuestionHandler() {
            const question = questionInput.value.trim();
            if (question) {
                addMessage('user', question);
                questionInput.value = '';
                
                // --- START: REAL API CALL ---
                callApiWithQuestion(question);
                // --- END: REAL API CALL ---
            }
        }

// ... existing code

        sendQuestion.addEventListener('click', sendQuestionHandler);
        questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendQuestionHandler();
            }
        });

        // Quick Questions
        document.querySelectorAll('.quick-question').forEach(btn => {
            btn.addEventListener('click', () => {
                questionInput.value = btn.textContent;
                sendQuestionHandler();
            });
        });

        // Add Message to Chat
        function addMessage(sender, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
            
            const bubble = document.createElement('div');
            bubble.className = `max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
            }`;
            
            if (sender === 'ai') {
                bubble.innerHTML = `<div class="flex items-start space-x-2">
                    <i class="fas fa-robot mt-1"></i>
                    <div class="whitespace-pre-wrap">${formatMessage(text)}</div>
                </div>`;
            } else {
                bubble.innerHTML = `<div class="whitespace-pre-wrap">${escapeHtml(text)}</div>`;
            }
            
            messageDiv.appendChild(bubble);
            
            if (chatContainer.querySelector('.text-center')) {
                chatContainer.innerHTML = '';
            }
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // Typing Indicator
        function showTypingIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'typingIndicator';
            indicator.className = 'chat-message flex justify-start';
            indicator.innerHTML = `
                <div class="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                    <div class="typing-indicator flex space-x-1">
                        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                    </div>
                </div>
            `;
            chatContainer.appendChild(indicator);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function removeTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) indicator.remove();
        }

        // Generate AI Response (Simulated)
        function generateAIResponse(question) {
            const lowerQuestion = question.toLowerCase();
            
            if (lowerQuestion.includes('about') || lowerQuestion.includes('summary')) {
                return `Based on the document, this appears to be a comprehensive overview of the subject matter. The document contains valuable information that addresses various aspects of the topic. Would you like me to elaborate on any specific section?`;
            } else if (lowerQuestion.includes('main point') || lowerQuestion.includes('key point')) {
                return `The main points from the document include:\n\n• Critical analysis of the subject\n• Supporting evidence and examples\n• Recommendations and conclusions\n\nWould you like more details on any of these?`;
            } else if (lowerQuestion.includes('date')) {
                return `I can help you identify important dates in the document. In a production system, I would analyze the document for specific dates and timelines. Is there a particular time period you're interested in?`;
            } else {
                return `That's a great question! Based on the document content, I can provide insights on that topic. In a real implementation, I would analyze the specific sections relevant to your question and provide detailed answers. Is there anything else you'd like to know?`;
            }
        }

        // Utility Functions
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function formatMessage(text) {
            // Simple markdown-like formatting
            text = escapeHtml(text);
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            text = text.replace(/\n•/g, '\n<br>•');
            text = text.replace(/\n\n/g, '<br><br>');
            return text;
        }
        // Inside your <script> tag, add this new function:

async function callApiWithQuestion(question) {
    if (!uploadedDocument) {
        addMessage('ai', "Please upload a document first!");
        return;
    }

    showTypingIndicator(); // Show indicator while waiting for AI

    try {
        // 1. Create FormData object
        const formData = new FormData();
        // The key 'file' must match the parameter name in FastAPI: file: UploadFile = File(...)
        formData.append('file', uploadedDocument); 
        // The key 'question' must match the parameter name in FastAPI: question: Annotated[str, Form(...)]
        formData.append('question', question);

        // 2. Make the POST request
        const response = await fetch(API_URL, {
            method: 'POST',
            // No need to set Content-Type header when using FormData, 
            // the browser handles it automatically (multipart/form-data)
            body: formData, 
        });

        removeTypingIndicator();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 3. Display the AI's answer
        addMessage('ai', data.answer);

    } catch (error) {
        removeTypingIndicator();
        console.error('API Error:', error);
        addMessage('ai', `❌ **Error:** Failed to get a response from the AI. The file might be too complex, or the server is unavailable. (${error.message})`);
    }
}
