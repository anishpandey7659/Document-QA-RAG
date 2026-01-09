# 📄 Document QA RAG System

A modern, full-stack Retrieval-Augmented Generation (RAG) application that enables intelligent question-answering over your PDF documents. Built with LangChain, Groq LLM, and a sleek web interface.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.105.0-green.svg)
![LangChain](https://img.shields.io/badge/LangChain-Latest-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🎥 Demo

📺 **See it in action!** Watch the full demo video on LinkedIn:

[![Demo Video](https://img.shields.io/badge/LinkedIn-Demo%20Video-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/posts/anish-pandey-9235a32a6_ai-langchain-fastapi-activity-7395786067347431424-CH8j)

> 🎬 Click the badge above to watch a complete walkthrough of the Document QA RAG system, including PDF upload, question-answering, and the RAG pipeline in action!

---

## 🌟 Features

- **📤 PDF Document Upload**: Easy drag-and-drop interface for uploading PDF documents
- **🤖 AI-Powered Q&A**: Ask natural language questions about your documents
- **🔍 Smart Retrieval**: Uses ChromaDB vector store with Maximum Marginal Relevance (MMR) for optimal context retrieval
- **⚡ Fast Responses**: Powered by Groq's ultra-fast Llama 3.1 8B model
- **🎨 Modern UI**: Clean, responsive interface with real-time feedback
- **🔒 Secure Processing**: Temporary file handling with automatic cleanup
- **📊 Context-Aware**: Retrieves and ranks the most relevant document chunks

## 🏗️ Architecture

```
Document-QA-RAG/
├── backend/
│   ├── app.py           # FastAPI server and endpoints
│   └── rag_logic.py     # RAG chain implementation
├── frontend/
│   ├── index.html       # Main UI
│   ├── scripts.js       # Frontend logic
│   └── style.css        # Styling
├── requirements.txt     # Python dependencies
└── README.md
```

### Technology Stack

**Backend:**
- FastAPI for REST API
- LangChain for RAG orchestration
- ChromaDB for vector storage
- HuggingFace Embeddings (all-MiniLM-L6-v2)
- Groq API with Llama 3.1 8B

**Frontend:**
- Vanilla JavaScript
- Modern CSS with animations
- Responsive design

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Groq API Key ([Get one here](https://console.groq.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anishpandey7659/Document-QA-RAG.git
   cd Document-QA-RAG
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\\Scripts\\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn app:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000`

2. **Open the frontend**
   
   Simply open `frontend/index.html` in your web browser, or use a local server:
   ```bash
   # Using Python's built-in server
   cd frontend
   python -m http.server 3000
   ```
   Then navigate to `http://localhost:3000`

## 💡 How It Works

### RAG Pipeline

1. **Document Loading**: PDFs are loaded using PyPDFLoader
2. **Text Splitting**: Documents are chunked using RecursiveCharacterTextSplitter (300 char chunks)
3. **Embedding**: Text chunks are embedded using HuggingFace's all-MiniLM-L6-v2 model
4. **Vector Storage**: Embeddings are stored in ChromaDB with unique collection IDs
5. **Retrieval**: MMR search retrieves top 5 most relevant chunks
6. **Generation**: Groq's Llama 3.1 generates accurate answers based on context

### API Endpoints

#### POST `/summarize_uploaded_document/`

Upload a PDF and ask questions about it.

**Request:**
- `file`: PDF file (multipart/form-data)
- `question`: Your question about the document (form field)

**Response:**
```json
{
  "answer": "AI-generated answer based on document context"
}
```

**Example using curl:**
```bash
curl -X POST "http://localhost:8000/summarize_uploaded_document/" \\
  -F "file=@document.pdf" \\
  -F "question=What are the key findings?"
```

## 🎯 Usage Example

1. Upload a research paper, report, or any PDF document
2. Ask questions like:
   - "What are the main conclusions?"
   - "Summarize the methodology section"
   - "What are the key statistics mentioned?"
   - "Who are the authors and what is their affiliation?"

The system will retrieve relevant sections and provide accurate, context-aware answers.

## 🔧 Configuration

### Customizing the RAG Chain

Edit `backend/rag_logic.py` to modify:

- **Chunk size**: Change `chunk_size=300` in RecursiveCharacterTextSplitter
- **Retrieval count**: Modify `k=5` in retriever settings
- **LLM model**: Switch `model="llama-3.1-8b-instant"` to other Groq models
- **Embedding model**: Change the HuggingFace model name

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | Required |

## 🛡️ Security Features

- ✅ File type validation (PDF/TXT only)
- ✅ Temporary file handling with automatic cleanup
- ✅ CORS protection (configurable origins)
- ✅ Error handling and proper HTTP status codes
- ✅ No persistent storage of uploaded documents

## 🐛 Troubleshooting

**Issue: "Invalid file type" error**
- Ensure you're uploading PDF or TXT files only

**Issue: Backend not starting**
- Check if port 8000 is available
- Verify all dependencies are installed
- Ensure `.env` file has valid GROQ_API_KEY

**Issue: Slow responses**
- First query may be slower due to model loading
- Check your internet connection (API calls to Groq)

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Anish Pandey**
- GitHub: [@anishpandey7659](https://github.com/anishpandey7659)
- Portfolio: [anishpandey.netlify.app](https://anishpandey.netlify.app/)
- Email: anishpandey1232@gmail.com

## 🙏 Acknowledgments

- LangChain for the RAG framework
- Groq for ultra-fast LLM inference
- HuggingFace for embedding models
- FastAPI for the backend framework

## 🔮 Future Enhancements

- [ ] Support for multiple document formats (DOCX, TXT, etc.)
- [ ] Chat history and conversation memory
- [ ] Multi-document queries
- [ ] Source citation in answers
- [ ] Document preprocessing options
- [ ] Batch processing capabilities
- [ ] Authentication and user management
- [ ] Docker containerization

---

⭐ If you find this project helpful, please give it a star!
"""

