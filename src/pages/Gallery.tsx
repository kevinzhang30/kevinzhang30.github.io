import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Add,
  Close,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  date: string;
  tags: string[];
}
// 
const Gallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);
  
  const fullText = "Fun photos, featuring me!";
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Fetch gallery configuration
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch('/config/gallery-config.json');
        const data = await response.json();
        setPhotos(data.photos);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error loading gallery config:', error);
        // Fallback to default data if config fails to load
        setPhotos([
          {
            id: 1,
            title: "Sunset at the Beach",
            description: "Beautiful golden hour at Malibu Beach. The waves were perfect and the sky was painted with amazing colors.",
            imageUrl: "/logo192.png",
            location: "Malibu, CA",
            date: "2024-01-15",
            tags: ["sunset", "beach", "nature", "photography"]
          },
          {
            id: 2,
            title: "Mountain Hiking",
            description: "Reached the summit after 6 hours of hiking. The view was absolutely breathtaking and worth every step.",
            imageUrl: "/logo192.png",
            location: "Rocky Mountains, CO",
            date: "2024-01-10",
            tags: ["hiking", "mountains", "adventure", "nature"]
          }
        ]);
        setCategories([
          { key: 'all', label: 'All Photos' },
          { key: 'nature', label: 'Nature' },
          { key: 'adventure', label: 'Adventure' },
          { key: 'urban', label: 'Urban' },
          { key: 'lifestyle', label: 'Lifestyle' },
          { key: 'art', label: 'Art' },
          { key: 'tech', label: 'Technology' }
        ]);
      }
    };

    fetchGalleryData();
  }, []);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsDialogOpen(true);
  };

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    photo.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Photo Gallery
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

        {/* Search Bar */}
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
            <TextField
              fullWidth
              placeholder="Search photos by title, description, tags, or location..."
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
          </Paper>
        </motion.div>

        {/* Photo Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card
                  elevation={3}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0, 131, 143, 0.3)',
                    },
                  }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={photo.imageUrl}
                    alt={photo.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {photo.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {photo.description.length > 80 
                        ? `${photo.description.substring(0, 80)}...` 
                        : photo.description
                      }
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {photo.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {photo.location}
                        </Typography>
                      </Box>
                      

                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        {filteredPhotos.length === 0 && (
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
                mt: 4,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No photos found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms.
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <Tooltip title="Add New Photo" placement="left">
          <Fab
            color="primary"
            aria-label="add photo"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <Add />
          </Fab>
        </Tooltip>
      </motion.div>

      {/* Photo Detail Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'cover',
                }}
              />
              
              <IconButton
                onClick={() => setIsDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                {selectedPhoto.title}
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                {selectedPhoto.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {selectedPhoto.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedPhoto.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(selectedPhoto.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                

              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
};

export default Gallery;
