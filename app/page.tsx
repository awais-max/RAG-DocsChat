"use client"

import type React from "react"
import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { FileUp, Upload, GraduationCap, BookOpen, Users, Rocket, FileText, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader } from "@/components/Loader"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"


export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isResponding, setIsResponding] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("document", file)

    const newSessionId = uuidv4()
    formData.append("sessionId", newSessionId)

    setIsUploading(true)
    try {
      const response = await axios.post("https://document-chat-backend.vercel.app/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Upload response:", response.data)
      if (response.data.success) {
        setSelectedFile(file)
        setSessionId(newSessionId)
        setMessages([
          {
            text: `we've successfully uploaded your file, "${file.name}", to our system. As part of the upload process, we converted the content of your file into embeddings, which are essentially numerical representations of the text that allow our AI models to understand and process the information more efficiently.

These embeddings have now been stored inside our Pinecone vector database, a powerful tool that enables us to manage and retrieve complex data structures like the one we've created from your file. This means that your file has been transformed into a knowledge base that can be easily accessed and utilized by our Deepseek platform.Let's chat about your document`,
            isUser: false,
          },
        ])
      }
    } catch (error: any) {
      console.error("Upload error:", error.response ? error.response.data : error.message)
      alert("Error uploading file: " + (error.response?.data?.error || error.message))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      setSessionId(uuidv4())
      setSelectedFile(file)
      setMessages([
        {
          text: `Successfully uploaded ${file.name} to LLM. Let's chat about your document!`,
          isUser: false,
        },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !sessionId) return

    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }])
    setInputMessage("")
    setIsResponding(true)

    try {
      const response = await axios.post("https://document-chat-backend.vercel.app/chat", {
        question: inputMessage,
        sessionId: sessionId,
      })

      if (response.data.response) {
        setMessages((prev) => [...prev, { text: response.data.response, isUser: false }])
      }
    } catch (error: any) {
      console.error("Chat error:", error.response ? error.response.data : error.message)
      alert("Error communicating with server: " + (error.response?.data?.error || error.message))
    } finally {
      setIsResponding(false)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  const features = [
    {
      icon: GraduationCap,
      title: "For Students",
      description:
        "Prepare for exams and homework. Generate custom presentation outline and speaker notes for your presentations.",
    },
    {
      icon: BookOpen,
      title: "For Researchers",
      description: "Upload research papers and get information you need with just one click. Summarize paper abstract.",
    },
    {
      icon: Users,
      title: "For Professionals",
      description:
        "Create an onboarding manual and training materials. Read contracts and financial reports 10X faster.",
    },
    {
      icon: Rocket,
      title: "Unlimited Upload",
      description: "No quantity limit. No questions limit.",
    },
    {
      icon: FileText,
      title: "Support Scanned Files",
      description:
        "we can now help you automatically read scanned materials.",
    },
    {
      icon: Target,
      title: "Cited Sources",
      description: "Answers base on PDF content with cited sources. No more scrolling to find the right page.",
    },
  ]

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 flex flex-col pt-2">
        <main className="flex-1 md:p-6 mt-2">
          {!selectedFile ? (
            <div className="max-w-screen-xl mx-auto">
              <Card className="bg-card p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-medium">Powered By  </span>
                  <img
                    src="https://vectorseek.com/wp-content/uploads/2025/01/DeepSeek-R1-Logo-PNG-Vector.png"
                    alt="Google Drive"
                    className="h-10 w-50"
                  />
                </div>

                <div
                  className={cn(
                    "border-2 border-dashed border-border rounded-xl p-12 text-center bg-background",
                    isDragging && "border-primary",
                  )}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="flex justify-center mb-4 gap-x-1">

                  <img                  
                    src ="https://static-00.iconduck.com/assets.00/file-type-doc-word-document-icon-854x1024-1rnlm4kz.png"
                    alt="Google Drive"
                    className="h-10 w-50"
                  />
                  <img                  
                    src ="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Icon_pdf_file.svg/1805px-Icon_pdf_file.svg.png"
                    alt="Google Drive"
                    className="h-10 w-50"
                  />
                     <img                  
                    src ="https://static-00.iconduck.com/assets.00/csv-icon-1791x2048-ot22nr8i.png"
                    alt="Google Drive"
                    className="h-10 w-30"
                  />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Click to Upload or Drop PDF/DOC here</h3>
                  <p className="text-muted-foreground mb-6">Upload files upto 50 MB</p>
                  <div className="flex flex-col items-center">
                    <label className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg cursor-pointer inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
                      <Upload size={20} />
                      Upload Files
                      <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                    </label>
                    {isUploading && (
                      <div className="mt-4">
                        <Loader text="Uploading file..." />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-md text-muted-foreground flex items-center justify-center gap-1">
                    Upload from
                    <img
                      src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                      alt="Google Drive"
                      className="h-10 w-10"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/480px-Microsoft_logo.svg.png"
                      alt="Google Drive"
                      className="h-5 w-5"
                    />
                    <span className="text-border">|</span>
                    <button className="text-primary hover:underline text">Set Language for Scanned files</button>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  {features.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon size={24} className="text-foreground" />
                        <h3 className="font-semibold">{title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col h-auto max-w-6xl mx-auto">
              <div className="flex-1 overflow-y-auto mb-20">
                <div className="space-y-6 p-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-slide-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                          }`}
                      >
                        {message.isUser ? (
                          message.text
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            {message.text.split("\n").map((line, i) => {
                              if (line.startsWith("# ")) {
                                return <h1 key={i}>{renderFormattedText(line.slice(2))}</h1>
                              } else if (line.startsWith("## ")) {
                                return <h2 key={i}>{renderFormattedText(line.slice(3))}</h2>
                              } else if (line.startsWith("- ")) {
                                return <li key={i}>{renderFormattedText(line.slice(2))}</li>
                              } else if (line.match(/^\d+\./)) {
                                return <li key={i}>{renderFormattedText(line.slice(line.indexOf(".") + 1).trim())}</li>
                              } else {
                                return <p key={i}>{renderFormattedText(line)}</p>
                              }
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isResponding && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] p-4 rounded-2xl shadow-sm bg-muted text-foreground">
                        <Loader text="Generating response..." />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/40 p-4">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                  <div className="relative flex items-end gap-4 bg-muted rounded-2xl p-4">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                      placeholder="Ask about your document..."
                      className="flex-1 bg-transparent border-0 resize-none max-h-[20px] min-h-[44px] p-2 focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                      rows={1}
                      style={{
                        overflow: "hidden",
                        height: "auto",
                      }}
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth rounded-xl px-6"
                      disabled={isResponding}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

