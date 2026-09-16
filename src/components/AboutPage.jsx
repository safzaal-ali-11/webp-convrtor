import React from 'react';
import { 
  User, 
  Brain, 
  Workflow, 
  Code2, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  Zap,
  Sparkles,
  Bot,
  Layers,
  MessageSquareQuote,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const contactLinks = [
    {
      name: 'Email',
      label: 'saith.afzaalali11@gmail.com',
      url: 'mailto:saith.afzaalali11@gmail.com',
      icon: Mail
    },
    {
      name: 'GitHub',
      label: 'github.com/safzaal-ali-11',
      url: 'https://github.com/safzaal-ali-11',
      icon: Github
    },
    {
      name: 'LinkedIn',
      label: 'linkedin.com/in/afzaal-ali-117a4440a',
      url: 'https://www.linkedin.com/in/afzaal-ali-117a4440a/',
      icon: Linkedin
    }
  ];

  const projects = [
    {
      id: 'ilm-dost',
      title: 'Ilm Dost – AI Syllabus-Based Learning Assistant',
      category: 'EdTech & AI',
      description: 'An AI-powered educational platform designed to help students learn from their official syllabus through structured content, assessments, and AI-assisted learning.',
      tags: ['Syllabus Learning', 'AI-Assisted Education', 'Structured Content', 'Progress Tracking', 'RAG Approach'],
      icon: BookOpen
    },
    {
      id: 'n8n-rag-chatbot',
      title: 'n8n RAG Chatbot',
      category: 'AI Workflow & RAG',
      description: 'A retrieval-augmented chatbot workflow built using n8n to explore how AI systems can retrieve relevant information and generate useful responses.',
      tags: ['n8n', 'RAG Workflow', 'Information Retrieval', 'AI Chatbot'],
      icon: Workflow
    },
    {
      id: 'customer-reply',
      title: 'AI Customer Reply System',
      category: 'Automation Workflow',
      description: 'An AI automation workflow that processes customer inquiries, generates replies using AI, and supports automated email responses.',
      tags: ['n8n Automation', 'Email Automation', 'AI Reply Generator'],
      icon: Bot
    },
    {
      id: 'customer-support-agent',
      title: 'AI Customer Support Agent',
      category: 'Agentic Automation',
      description: 'An AI automation workflow designed to classify customer messages and use available order information to support customer responses.',
      tags: ['Intent Classification', 'Customer Support', 'Order Context', 'AI Agent'],
      icon: Zap
    },
    {
      id: 'social-media-manager',
      title: 'AI Social Media Manager',
      category: 'Content Automation',
      description: 'An AI automation workflow for generating social media captions and organizing the generated content through a structured workflow.',
      tags: ['Content Generation', 'Social Media', 'n8n Workflow'],
      icon: Sparkles
    }
  ];

  return (
    <div className="about-wrapper">
      {/* 1. Hero Section */}
      <section className="about-hero glass-card">
        <div className="hero-layout">
          <div className="hero-content">
            <div className="profile-badge">
              <GraduationCap size={16} color="var(--primary-glow)" />
              <span>Software Engineering Graduate</span>
            </div>

            <h1 className="hero-name">Hi, I'm Afzaal Ali.</h1>

            <p className="hero-tagline">
              Software Engineering graduate focused on <strong>AI</strong>, <strong>AI Automation</strong>, and <strong>AI Agents</strong>.
            </p>

            <p className="hero-intro">
              I enjoy learning how intelligent systems work and building practical applications that solve real problems. My current focus is strengthening my AI foundations, exploring automation workflows, and developing useful AI-powered products.
            </p>

            <div className="hero-badges">
              <span className="hero-chip"><Brain size={14} /> AI & ML Foundations</span>
              <span className="hero-chip"><Workflow size={14} /> n8n Automation</span>
              <span className="hero-chip"><Bot size={14} /> AI Agents</span>
            </div>
          </div>

          <div className="hero-avatar-container">
            <div className="avatar-frame">
              <img
                src="/afzaal-ali.jpg"
                alt="Afzaal Ali - Software Engineer & AI Creator"
                className="profile-img"
              />
              <div className="avatar-glow-ring" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Personal Mission / Goals */}
      <section className="about-section glass-card">
        <div className="section-title-wrap">
          <Target size={22} className="section-icon" />
          <h2>Mission & Personal Goals</h2>
        </div>
        <p className="section-subtitle">
          What I am working toward as I build my engineering career:
        </p>
        <div className="goals-grid">
          <div className="goal-card">
            <div className="goal-num">01</div>
            <h3>Build Practical AI Solutions</h3>
            <p>Develop useful software applications that apply artificial intelligence to solve real-world problems.</p>
          </div>

          <div className="goal-card">
            <div className="goal-num">02</div>
            <h3>Automate Repetitive Tasks</h3>
            <p>Design workflow automation systems that reduce manual effort and streamline operational processes.</p>
          </div>

          <div className="goal-card">
            <div className="goal-num">03</div>
            <h3>Explore Intelligent Agents</h3>
            <p>Study agentic AI concepts and agentic workflows to build autonomous, context-aware software systems.</p>
          </div>

          <div className="goal-card">
            <div className="goal-num">04</div>
            <h3>Continuous Skill Development</h3>
            <p>Deepen my problem-solving skills, software architecture knowledge, and AI engineering practices.</p>
          </div>
        </div>
      </section>

      {/* 3. Skills & Knowledge */}
      <section className="about-section glass-card">
        <div className="section-title-wrap">
          <Code2 size={22} className="section-icon" />
          <h2>Skills & Technical Knowledge</h2>
        </div>

        <div className="skills-grid">
          {/* AI & Machine Learning */}
          <div className="skill-category">
            <div className="skill-cat-header">
              <Brain size={18} color="var(--primary-glow)" />
              <h3>AI & Machine Learning</h3>
            </div>
            <ul className="skill-list">
              <li><CheckCircle2 size={14} className="check-icon" /> AI Fundamentals</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Machine Learning Fundamentals</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Supervised Learning</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Unsupervised Learning</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Reinforcement Learning</li>
            </ul>
          </div>

          {/* AI Automation & Agents */}
          <div className="skill-category">
            <div className="skill-cat-header">
              <Workflow size={18} color="#10b981" />
              <h3>AI Automation & Agents</h3>
            </div>
            <ul className="skill-list">
              <li><CheckCircle2 size={14} className="check-icon" /> AI Automation</li>
              <li><CheckCircle2 size={14} className="check-icon" /> n8n Workflow Automation</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Basic Agentic AI Concepts</li>
              <li><CheckCircle2 size={14} className="check-icon" /> AI Agents</li>
              <li><CheckCircle2 size={14} className="check-icon" /> RAG Chatbot Workflows</li>
            </ul>
          </div>

          {/* Development & Engineering */}
          <div className="skill-category">
            <div className="skill-cat-header">
              <Code2 size={18} color="#9c27b0" />
              <h3>Software Engineering</h3>
            </div>
            <ul className="skill-list">
              <li><CheckCircle2 size={14} className="check-icon" /> Software Engineering Principles</li>
              <li><CheckCircle2 size={14} className="check-icon" /> React / Web Application Development</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Python & Scripting</li>
              <li><CheckCircle2 size={14} className="check-icon" /> Database & Application Architecture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Projects Section */}
      <section className="about-section glass-card">
        <div className="section-title-wrap">
          <Layers size={22} className="section-icon" />
          <h2>Projects I've Built</h2>
        </div>

        <div className="projects-grid">
          {projects.map((proj) => {
            const IconComp = proj.icon;
            return (
              <div key={proj.id} className="project-card">
                <div className="project-card-header">
                  <div className="proj-icon-box">
                    <IconComp size={20} color="var(--primary-glow)" />
                  </div>
                  <span className="proj-category">{proj.category}</span>
                </div>

                <h3 className="project-title">{proj.title}</h3>
                <p className="project-desc">{proj.description}</p>

                <div className="project-tags">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="proj-tag">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Currently Learning */}
      <section className="about-section glass-card">
        <div className="section-title-wrap">
          <BookOpen size={22} className="section-icon" />
          <h2>Currently Learning</h2>
        </div>
        <p className="section-subtitle">
          Active topics in my ongoing technical learning journey:
        </p>

        <div className="learning-chips-grid">
          <div className="learning-chip">
            <Sparkles size={16} color="var(--primary-glow)" />
            <span>AI Automation</span>
          </div>
          <div className="learning-chip">
            <Bot size={16} color="var(--primary-glow)" />
            <span>AI Agents</span>
          </div>
          <div className="learning-chip">
            <Zap size={16} color="var(--primary-glow)" />
            <span>Agentic AI Fundamentals</span>
          </div>
          <div className="learning-chip">
            <Workflow size={16} color="var(--primary-glow)" />
            <span>Retrieval-Augmented Generation (RAG)</span>
          </div>
          <div className="learning-chip">
            <Code2 size={16} color="var(--primary-glow)" />
            <span>Practical AI Application Development</span>
          </div>
          <div className="learning-chip">
            <Brain size={16} color="var(--primary-glow)" />
            <span>Advanced Machine Learning Foundations</span>
          </div>
        </div>
      </section>

      {/* 6. Contact & Social Links */}
      <section className="about-section glass-card">
        <div className="section-title-wrap">
          <Mail size={22} className="section-icon" />
          <h2>Connect & Contact</h2>
        </div>
        <p className="section-subtitle">
          Feel free to reach out for inquiries, discussions on AI automation, or technical collaboration:
        </p>

        <div className="contact-grid">
          {contactLinks.map((link) => {
            const IconComp = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="contact-card"
              >
                <div className="contact-icon-box">
                  <IconComp size={22} />
                </div>
                <div className="contact-info">
                  <span className="contact-name">{link.name}</span>
                  <span className="contact-label">{link.label}</span>
                </div>
                <ExternalLink size={16} className="contact-arrow" />
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
