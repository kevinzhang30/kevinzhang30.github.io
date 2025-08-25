import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Download, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Resume: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resumeData, setResumeData] = useState<any>(null);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  
  const fullText = "Download my resume or view it online. Feel free to reach out.";
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Fetch resume configuration data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch resume data
        const resumeResponse = await fetch('/config/resume-config.json');
        const resumeData = await resumeResponse.json();
        setResumeData(resumeData);

        // Fetch personal info
        const personalResponse = await fetch('/config/personal-info.json');
        const personalData = await personalResponse.json();
        setPersonalInfo(personalData);
      } catch (error) {
        console.error('Error loading configuration:', error);
        // Fallback to default data if config fails to load
        setResumeData({
          education: {
            university: "University of Waterloo & Wilfrid Laurier University",
            degrees: "BCS, Bachelor of Computer Science & BBA, Bachelor of Business Administration",
            timeline: "2023-2028"
          },
          experience: {
            title: "Instructional Support Assistant",
            company: "University of Waterloo",
            duration: "Jan-Apr 2025",
            description: "Technical guidance for 120+ students in Bash, C, and coding principles"
          },
          skills: ["C/C++", "Python", "Java", "React", "Spring Boot", "AWS", "Git"],
          projects: [
            "Clinic Management App (Full-stack healthcare web app)",
            "C-like Language Compiler (C++ compiler with top 1% efficiency)",
            "Travel Budgeting Android App (Kotlin + Firebase)"
          ],
          resumeFile: {
            filename: "Kevin_Zhang_Resume_Winter2026.pdf",
            displayName: "Kevin_Zhang_Resume_Winter2026.pdf"
          }
        });

        setPersonalInfo({
          aboutMe: {
            title: "About Me",
            description: "I'm a Computer Science student at the University of Waterloo, passionate about creating innovative software solutions and building robust digital infrastructure. I'm currently seeking internship opportunities for Winter and Summer 2026.",
            longTermGoal: "My long-term goal is to develop smart software solutions that solve real-world problems and contribute to building the digital infrastructure of tomorrow.",
            athletics: "I'm currently a member of the varsity swim team at the University of Waterloo, and was previously on the Canadian National Team, competing at the World Junior Championships and Pan American Games."
          },
          contact: {
            email: "k73zhang@uwaterloo.ca",
            phone: "(416)-526-7856",
            location: "Waterloo, Ontario, Canada"
          },
          interests: [
            "Software Engineering",
            "Digital Infrastructure",
            "Problem Solving",
            "Team Collaboration",
            "Swimming & Athletics"
          ]
        });
      }
    };

    fetchData();
  }, []);

  const handleDownload = () => {
    if (!resumeData) return;
    
    setIsLoading(true);
    // Download actual resume file
    const link = document.createElement('a');
    link.href = `/${resumeData.resumeFile.filename}`;
    link.download = resumeData.resumeFile.displayName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}
          >
            Resume
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto', fontFamily: 'monospace', minHeight: '2.5rem' }}
          >
            {text}
            <span className="typewriter-cursor">|</span>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} /> : <Download />}
              onClick={handleDownload}
              disabled={isLoading}
              sx={{ px: 4, py: 1.5 }}
            >
              {isLoading ? 'Downloading...' : 'Download PDF'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={showPdf ? <VisibilityOff /> : <Visibility />}
              onClick={() => setShowPdf(!showPdf)}
              sx={{ px: 4, py: 1.5 }}
            >
              {showPdf ? 'Hide Resume' : 'View Online'}
            </Button>
          </Box>
        </Box>

        {showPdf ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#f8f9fa',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Resume Preview
              </Typography>
              
              {/* PDF Embedding - Your actual resume */}
              <iframe
                src={`/${resumeData?.resumeFile?.filename || 'Kevin_Zhang_Resume_Winter2026.pdf'}`}
                width="100%"
                height="800px"
                style={{
                  border: 'none',
                  borderRadius: '8px',
                }}
                title="Kevin Zhang Resume"
              />
            </Paper>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {!resumeData || !personalInfo ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <>
                {/* About Me Section */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
                    mb: 4,
                  }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>
                    {personalInfo.aboutMe.title}
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 3, textAlign: 'center' }}>
                    {personalInfo.aboutMe.description}
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 4, textAlign: 'center', fontStyle: 'italic' }}>
                    {personalInfo.aboutMe.longTermGoal}
                  </Typography>

                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 4, textAlign: 'center' }}>
                    {personalInfo.aboutMe.athletics}
                  </Typography>

                  {/* Interests Tags */}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                      🎯 Areas of Interest
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {personalInfo.interests.map((interest: string) => (
                        <Box
                          key={interest}
                          sx={{
                            px: 3,
                            py: 1,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: 3,
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(0, 131, 143, 0.3)',
                          }}
                        >
                          {interest}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>

                {/* Call to Action */}
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    📄 View Full Resume
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Click "View Online" above to see the complete PDF version, or download it directly using the download button.
                  </Typography>
                </Paper>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default Resume;
