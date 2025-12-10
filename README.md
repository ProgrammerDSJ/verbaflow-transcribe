<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# VerbaFlow Transcribe

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-4285F4?logo=google)](https://deepmind.google/technologies/gemini/)
[![Try Demo](https://img.shields.io/badge/Try%20Demo-Live%20App-success)](https://verbaflow-transcribe-581656953781.us-west1.run.app/)

An AI-powered multi-language, multi-speaker transcription web application designed for transcribing long-form content like podcasts, lectures, and interviews without expensive subscription fees.

**Powered by Google Gemini 2.5 Flash** for lightning-fast, accurate transcription with intelligent context awareness.

---

## 🎯 Overview

VerbaFlow Transcribe leverages Google's Gemini 2.5 Flash model to provide accurate, cost-effective transcription services. Whether you're transcribing a 3-hour podcast or a university lecture, VerbaFlow handles multi-speaker scenarios, supports multiple languages, and processes hours of content efficiently.

**Why VerbaFlow?**
Traditional transcription services charge $1-3 per minute of audio. A 2-hour podcast could cost **$120-360 per episode**! VerbaFlow uses Gemini 2.5 Flash's efficient API, making transcription affordable—no monthly subscriptions, just pay for what you use.

---

## 🌐 Try VerbaFlow Now

### 🚀 **Live Demo Available**

**Try the hosted version**: [https://verbaflow-transcribe-581656953781.us-west1.run.app/](https://verbaflow-transcribe-581656953781.us-west1.run.app/)

#### Free Tier Includes:
- ✅ **2 hour of transcription per month** (free)
- ✅ All core features (multi-speaker, editing, chapters)
- ✅ No credit card required
- ✅ No setup or installation needed

#### Need More?

**Option 1: Self-Host (Free & Unlimited)** 🆓
- Clone this repository and run with your own Gemini API key
- Unlimited transcription hours
- Full control over your data
- Perfect for developers and tech-savvy users
- See [Installation & Setup](#installation--setup) below

**Option 2: Premium Hosted Plan** 💎
- Visit the app and check pricing for extended usage
- No setup required - just upload and transcribe
- Priority processing and support
- Perfect for non-technical users who value convenience

Choose the option that works best for you!

---

## ✨ Key Features

### Core Functionality
- **🎵 Multi-Format Support** - Upload MP3, WAV, M4A, FLAC, OGG, and more
- **🌍 Multi-Language Transcription** - Supports 100+ languages with Gemini's advanced language understanding
- **👥 Multi-Speaker Detection** - Automatically identifies and labels different speakers
- **⚡ Smart Audio Splitting** - Divides long audio into 2-minute segments to optimize processing within Gemini's context window
- **🧠 Context-Aware Processing** - Maintains conversation context across segments to prevent speaker role swapping
- **📝 Interactive Editing** - Built-in editor to correct spelling errors and refine transcriptions
- **🏷️ Custom Speaker Labels** - Rename "Speaker 1" to actual names (e.g., "Host", "Guest", "Dr. Smith")
- **📑 Chapter Management** - Add chapters and timestamps to organize long transcriptions
- **💾 Export Options** - Download transcriptions in multiple formats

### Technical Advantages
- **Long-Form Optimized** - Handles podcasts and lectures spanning multiple hours
- **Cost-Effective** - No subscription fees, transparent API usage costs
- **Fast Processing** - Gemini 2.5 Flash provides industry-leading speed
- **High Accuracy** - State-of-the-art AI transcription with minimal errors
- **Privacy-Focused** - Your audio files are processed securely

---

## 🚀 How It Works

VerbaFlow uses an intelligent multi-stage processing pipeline:

1. **📤 File Upload**
   - User uploads an audio file through the web interface
   - Supported formats: MP3, WAV, M4A, FLAC, OGG, AAC, WEBM
   - Maximum file size: 500MB per file

2. **🔄 Automatic Processing**
   - Transcription starts automatically after upload
   - No manual configuration needed (works out of the box)

3. **✂️ Smart Audio Splitting**
   - Large audio files are intelligently divided into 2-minute segments
   - This optimizes processing within Gemini 2.0 Flash's context window
   - Maintains audio quality and context boundaries

4. **🤖 AI Transcription**
   - Each segment is transcribed using Gemini 2.0 Flash
   - Multi-speaker detection identifies different voices
   - Language is automatically detected (or manually selected)

5. **🔗 Context-Aware Stitching**
   - Segments are intelligently merged back together
   - Context awareness prevents speaker role confusion
   - Maintains conversation flow across segment boundaries

6. **✏️ Interactive Editing**
   - Review your transcription in the built-in editor
   - Fix rare spelling errors with one click
   - Add punctuation or formatting as needed

7. **🎭 Customization**
   - Rename speakers: "Speaker 1" → "Host", "Speaker 2" → "Guest Name"
   - Add chapter markers for easy navigation
   - Organize long transcriptions into logical sections

8. **💾 Export & Save**
   - Download in your preferred format (CSV, PDF)
   - Copy to clipboard for quick use
   - Save progress and return later

---

## 🛠️ Tech Stack

- **Frontend Framework**: React using TypeScript (built with Google AI Studio)
- **AI Model**: Google Gemini 2.5 Flash
- **API**: Google AI Studio / Gemini API
- **Audio Processing**: Web Audio API / FFmpeg
- **Runtime**: Node.js
- **File Handling**: Multipart form data with chunking support

---

## 📦 Run and Deploy Your App

### 🎯 Two Ways to Use VerbaFlow

#### 1️⃣ **Use the Hosted Version** (Easiest)
Simply visit [https://verbaflow-transcribe-581656953781.us-west1.run.app/](https://verbaflow-transcribe-581656953781.us-west1.run.app/)
- Free tier: 1 hour/month
- No setup required
- Check pricing on the site for extended usage

#### 2️⃣ **Self-Host (Free & Unlimited)** (For Developers)
Run VerbaFlow locally with your own Gemini API key - completely free with unlimited usage!

This section contains everything you need to run VerbaFlow locally.

**View your app in AI Studio**: https://ai.studio/apps/drive/1cYYl56o9lQFhQL5UPvd5Ic71cDdLE0qA

### Prerequisites

- **Node.js** (v16 or higher)
- **Gemini API Key** (Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key**
   
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/app/apikey

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

---

## 📖 Usage Guide

### Basic Workflow

1. **Upload Audio File**
   - Click "Upload" or drag and drop your audio file
   - Transcription starts automatically

2. **Wait for Processing**
   - Watch real-time progress as segments are processed
   - Processing time depends on file length (typically 1:4 ratio - 1 hour audio = ~15 min processing)

3. **Review Transcription**
   - Transcription appears with speaker labels and timestamps
   - Accuracy is typically 95%+ for clear audio

4. **Edit & Customize**
   - Click any text to edit spelling or wording
   - Rename speakers using the speaker panel
   - Add chapter markers for long content

5. **Export**
   - Download as TXT, SRT (subtitles), VTT, or JSON
   - Copy to clipboard for immediate use

### Pro Tips

- **For best results**: Use clear audio with minimal background noise
- **Multiple speakers**: The AI automatically detects speaker changes
- **Long podcasts**: The 2-minute splitting ensures optimal processing
- **Editing**: Make corrections inline - changes save automatically
- **Chapters**: Add chapters at key moments for easy navigation

---

## 🗂️ Project Structure

```
project-root/
├── App.tsx
├── index.html
├── index.tsx
├── metadata.json
├── types.ts
│
├── components/
│   ├── FileUpload.tsx
│   └── TranscriptionResult.tsx
│
└── services/
    ├── fileUtils.ts
    └── geminiService.ts
```

---

## 🔒 License & Usage Terms

### GNU Affero General Public License v3.0 (AGPL-3.0)

**Copyright (c) 2025 VerbaFlow Transcribe**

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

### What This Means For You:

#### ✅ **You CAN:**
- ✅ Use VerbaFlow for personal or commercial purposes
- ✅ Study how VerbaFlow works and modify the source code
- ✅ Redistribute copies of VerbaFlow
- ✅ Distribute your modified versions
- ✅ Run your own instance (self-host) for free

#### ⚠️ **You MUST:**
- ⚠️ **Share your source code** if you distribute VerbaFlow or modified versions
- ⚠️ **Use AGPL-3.0 license** for any derivative works
- ⚠️ **Provide source code** to users if you host VerbaFlow as a web service (this is the key AGPL requirement)
- ⚠️ Keep all copyright and license notices intact
- ⚠️ State significant changes made to the code
- ⚠️ Include a copy of the AGPL-3.0 license with your distribution

#### ❌ **You CANNOT:**
- ❌ Host a modified version as a service without sharing your source code
- ❌ Use VerbaFlow in proprietary software without releasing your code
- ❌ Remove or modify copyright notices
- ❌ Hold the authors liable for any damages

### Why AGPL-3.0?

The **Affero GPL** is specifically designed for web applications like VerbaFlow. The key difference from regular GPL is the **"network use" clause**:

> **If you run a modified version of VerbaFlow as a web service that others can access, you MUST provide them with the source code of your modified version.**

This ensures:
- 🛡️ The open-source community benefits from improvements
- 🤝 Prevents proprietary forks that don't give back
- 💡 Encourages collaboration and transparency
- 🔐 Protects the project from being exploited commercially without contribution

### Commercial Licensing

If you need to use VerbaFlow in a way that's incompatible with AGPL-3.0 (e.g., in proprietary software without releasing source code), **commercial licenses are available**. Contact us for details.

### Patent Grant

This license includes an explicit patent grant. Contributors grant you the right to use any patents they hold that are necessary to use VerbaFlow.

### Dual Licensing Model

VerbaFlow is available under two licensing options:

1. **AGPL-3.0 (Free & Open Source)**
   - Self-host with your own Gemini API key
   - Unlimited usage for personal or commercial purposes
   - Must share source code if you modify and host as a service

2. **Commercial Hosted Service**
   - Use our hosted version at [https://verbaflow-transcribe-581656953781.us-west1.run.app/](https://verbaflow-transcribe-581656953781.us-west1.run.app/)
   - Free tier: 1 hour of transcription per month
   - Premium plans available for extended usage
   - No setup, no API keys needed

**Full License**: See [LICENSE](LICENSE) file for complete terms.

---

## 🤝 Contributing

Contributions are welcome! VerbaFlow is open source under AGPL-3.0, and we encourage community involvement.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure your code works with Gemini 2.5 Flash API

By contributing, you agree that your contributions will be licensed under AGPL-3.0.

---

## 🗺️ Roadmap

- [ ] Real-time transcription streaming
- [ ] More export formats (DOCX, SRT, etc.)
- [ ] Batch processing for multiple files
- [ ] Custom vocabulary for domain-specific terms
- [ ] Translation alongside transcription
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] Collaborative editing features
- [ ] Webhook support for automation

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "API Key Invalid"
- **Solution**: Ensure your Gemini API key is correctly set in `.env.local`
- Check for extra spaces or quotes around the key

**Issue**: "File too large"
- **Solution**: Maximum file size is 500MB. Compress your audio or split it into smaller files

**Issue**: "Transcription taking too long"
- **Solution**: Large files are split into 2-minute segments. A 2-hour file typically takes 15-30 minutes

**Issue**: "Speaker labels mixed up"
- **Solution**: Use the speaker manager to manually correct labels. Context awareness minimizes this, but some edge cases may occur

**Issue**: "Spelling errors in transcription"
- **Solution**: Use the built-in editor to correct mistakes. Technical terms or uncommon names may need manual correction

---

## 💡 API Rate Limits

Gemini 2.5 Flash has generous rate limits. For current limits and pricing, visit:
- **Rate Limits**: https://ai.google.dev/gemini-api/docs/models/gemini#rate-limits
- **Pricing**: https://ai.google.dev/pricing

**Typical Usage**: A 1-hour audio file costs approximately $0.50-2.00 in API fees (varies by model tier).

---

## 📞 Support

Need help? Here's how to get assistance:

- **Issues**: Open an issue on [GitHub Issues](https://github.com/yourusername/verbaflow-transcribe/issues)
- **Documentation**: Read the [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- **Community**: Join discussions in GitHub Discussions
- **Commercial Support**: Contact us for priority support and custom features

---

## 🙏 Acknowledgments

- **Powered by**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/)
- **Built with**: [Google AI Studio](https://aistudio.google.com/)
- **Inspired by**: The need for accessible, affordable transcription services
- **Thanks to**: Open-source community and all contributors

---

## 📜 Legal

**VerbaFlow Transcribe** is licensed under the GNU Affero General Public License v3.0.

This program is distributed in the hope that it will be useful, but **WITHOUT ANY WARRANTY**; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.

---

## 👨‍💻 Author

Built with ❤️ using Gemini 2.5 Flash and Google AI Studio

**Live Demo**: [https://verbaflow-transcribe-581656953781.us-west1.run.app/](https://verbaflow-transcribe-581656953781.us-west1.run.app/)

**Note**: This app was created using Gemini 2.5 Flash for rapid prototyping and intelligent transcription. You can either use the hosted version (free tier: 1 hour/month) or self-host with your own Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) for unlimited usage.

---

**⭐ If you find VerbaFlow useful, please consider starring the repository!**

**🚀 Try it now**: [Launch VerbaFlow](https://verbaflow-transcribe-581656953781.us-west1.run.app/)
