import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Search,
  GitHub,
  Launch,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  category: string;
}

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);
  
  const fullText = "Some of the cool things I've built.";
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Fetch projects configuration
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetch('/config/projects-config.json');
        const data = await response.json();
        setProjects(data.projects);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error loading projects config:', error);
        // Fallback to default data if config fails to load
        setProjects([
          {
            id: 1,
            title: "ClinicMS",
            description: "A full stack healthcare management web application using Spring Boot, JWT, Maven, React, JavaScript, and Axios. Features comprehensive patient management, appointment scheduling, and healthcare provider workflows.",
            image: "https://via.placeholder.com/400x250/1976d2/ffffff?text=ClinicMS",
            technologies: ["Spring Boot", "JWT", "Maven", "React", "JavaScript", "Axios"],
            githubUrl: "https://github.com/kevin/clinicms",
            liveUrl: "https://clinicms-demo.com",
            category: "web"
          },
          {
            id: 2,
            title: "TripWise",
            description: "An Android app that allows you to easily manage expenses on vacation using Kotlin, Gradle, Firebase, and Google Maps API. Features expense tracking, location-based spending insights, and travel budget management.",
            image: "https://via.placeholder.com/400x250/4caf50/ffffff?text=TripWise",
            technologies: ["Kotlin", "Gradle", "Firebase", "Google Maps API", "Android"],
            githubUrl: "https://github.com/kevin/tripwise",
            category: "mobile"
          },
          {
            id: 3,
            title: "CC3K",
            description: "A command-line dungeon crawler game highlighting principles of object-oriented programming using C++. Features procedural generation, combat mechanics, and demonstrates advanced OOP concepts like inheritance and polymorphism.",
            image: "https://via.placeholder.com/400x250/ff9800/ffffff?text=CC3K",
            technologies: ["C++", "Object-Oriented Programming", "Command Line", "Game Development"],
            githubUrl: "https://github.com/kevin/cc3k",
            category: "game"
          }
        ]);
        setCategories([
          { key: 'all', label: 'All Projects' },
          { key: 'web', label: 'Web Development' },
          { key: 'mobile', label: 'Mobile Apps' },
          { key: 'game', label: 'Game Development' }
        ]);
      }
    };

    fetchProjectsData();
  }, []);



  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getTechnologyColor = (tech: string) => {
    return '#00838f'; // Primary teal color for all technologies
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}
            >
              My Projects
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto', fontFamily: 'monospace', minHeight: '2.5rem' }}
            >
              {text}
              <span className="typewriter-cursor">|</span>
            </Typography>
          </motion.div>
        </Box>

        {/* Search and Filter */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.dark',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map((category) => (
                  <Chip
                    key={category.key}
                    label={category.label}
                    onClick={() => setSelectedCategory(category.key)}
                    variant={selectedCategory === category.key ? "filled" : "outlined"}
                    color={selectedCategory === category.key ? "primary" : "default"}
                    sx={{
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* Projects Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 4 }}>
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                                      '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0, 131, 143, 0.3)',
                    },
                }}
              >
                {/* <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                  sx={{ objectFit: 'cover' }}
                /> */}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {project.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {project.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: getTechnologyColor(tech),
                          color: 'white',
                          fontSize: '0.75rem',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease-in-out',
                          },
                        }}
                      />
                    ))}
                  </Box>
                  

                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<GitHub />}
                    href={project.githubUrl}
                    target="_blank"
                    sx={{ flex: 1 }}
                  >
                    Code
                  </Button>
                  
                  {project.liveUrl && (
                    <Button
                      size="small"
                      startIcon={<Launch />}
                      href={project.liveUrl}
                      target="_blank"
                      variant="outlined"
                      sx={{ flex: 1 }}
                    >
                      Live Demo
                    </Button>
                  )}
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: '#f8f9fa',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or category filter.
              </Typography>
            </Paper>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default Projects;
