import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Category,
  Flag,
  Close,
  School,
  BeachAccess,
  SportsSoccer,
  Business,
  Flight,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Visit {
  id: string;
  dateRange: string;
  purpose: string;
  category: string;
  description: string;
  highlights: string[];
}

interface Location {
  id: number;
  city: string;
  country: string;
  countryCode: string;
  coordinates: [number, number];
  visits: Visit[];
}

interface Category {
  key: string;
  label: string;
  color: string;
}

interface TravelData {
  locations: Location[];
  categories: Category[];
}

const Map: React.FC = () => {
  const [travelData, setTravelData] = useState<TravelData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const fullText = "Places I've visited around the world";
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Fetch travel configuration data
  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const response = await fetch('/config/travel-config.json');
        const data = await response.json();
        setTravelData(data);
      } catch (error) {
        console.error('Error loading travel config:', error);
        // Fallback to default data if config fails to load
        setTravelData({
          locations: [],
          categories: [
            { key: 'all', label: 'All Visits', color: '#00838f' },
            { key: 'education', label: 'Education', color: '#1976d2' },
            { key: 'leisure', label: 'Leisure', color: '#4caf50' },
            { key: 'sports', label: 'Sports', color: '#ff9800' },
            { key: 'business', label: 'Business', color: '#9c27b0' }
          ]
        });
      }
    };

    fetchTravelData();
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsDialogOpen(true);
  };

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLocation(null);
    setSelectedVisit(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education':
        return <School />;
      case 'leisure':
        return <BeachAccess />;
      case 'sports':
        return <SportsSoccer />;
      case 'business':
        return <Business />;
      default:
        return <Flight />;
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = travelData?.categories.find(c => c.key === category);
    return cat?.color || '#00838f';
  };

  const filteredLocations = travelData?.locations.filter(location => {
    if (selectedCategory === 'all') return true;
    return location.visits.some(visit => visit.category === selectedCategory);
  }) || [];

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

  // Custom marker icon
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
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
              Travel Map
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

        {/* Category Filter */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            {travelData?.categories.map((category) => (
              <Chip
                key={category.key}
                label={category.label}
                onClick={() => setSelectedCategory(category.key)}
                sx={{
                  backgroundColor: selectedCategory === category.key ? category.color : 'transparent',
                  color: selectedCategory === category.key ? 'white' : 'text.primary',
                  border: `2px solid ${category.color}`,
                  '&:hover': {
                    backgroundColor: category.color,
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </motion.div>

        {/* Interactive Map */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
              mb: 4,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3, textAlign: 'center' }}>
              🌍 Interactive World Map
            </Typography>
            
            {/* Real Interactive Map */}
            <Box
              sx={{
                width: '100%',
                height: '600px',
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              <MapContainer
                center={[20.0, 0.0]}
                zoom={1.5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                dragging={true}
                touchZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Location Markers */}
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={location.coordinates}
                    icon={createCustomIcon(getCategoryColor(location.visits[0]?.category || 'all'))}
                    eventHandlers={{
                      click: () => handleLocationClick(location),
                    }}
                  >
                    <Popup>
                      <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {location.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {location.country}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {location.visits.length} visit{location.visits.length !== 1 ? 's' : ''}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleLocationClick(location)}
                          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Country Highlighting Circles */}
                {filteredLocations.map((location) => (
                  <Circle
                    key={`circle-${location.id}`}
                    center={location.coordinates}
                    radius={50000} // 500km radius
                    pathOptions={{
                      color: getCategoryColor(location.visits[0]?.category || 'all'),
                      fillColor: getCategoryColor(location.visits[0]?.category || 'all'),
                      fillOpacity: 0.1,
                      weight: 2,
                    }}
                  />
                ))}
              </MapContainer>
            </Box>
          </Paper>
        </motion.div>

        {/* Location List */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {filteredLocations.map((location) => (
              <Paper
                key={location.id}
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 131, 143, 0.3)',
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
                onClick={() => handleLocationClick(location)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {location.city}
                  </Typography>
                  <Flag sx={{ color: 'text.secondary', ml: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {location.country}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {location.visits.length} visit{location.visits.length !== 1 ? 's' : ''}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {location.visits.map((visit) => (
                    <Chip
                      key={visit.id}
                      label={visit.purpose}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(visit.category),
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </motion.div>

        {/* Location Details Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {selectedLocation?.city}, {selectedLocation?.country}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {selectedLocation && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
                  Visit History
                </Typography>
                
                <List>
                  {selectedLocation.visits.map((visit, index) => (
                    <Box key={visit.id}>
                      <ListItem
                        sx={{
                          backgroundColor: selectedVisit?.id === visit.id ? 'rgba(0, 131, 143, 0.1)' : 'transparent',
                          borderRadius: 2,
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 131, 143, 0.05)',
                          },
                        }}
                        onClick={() => handleVisitClick(visit)}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              color: getCategoryColor(visit.category),
                            }}
                          >
                            {getCategoryIcon(visit.category)}
                          </Box>
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {visit.purpose}
                              </Typography>
                              <Chip
                                label={visit.category}
                                size="small"
                                sx={{
                                  backgroundColor: getCategoryColor(visit.category),
                                  color: 'white',
                                  fontSize: '0.7rem',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <CalendarToday sx={{ fontSize: 16 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {visit.dateRange}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {visit.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      
                      {selectedVisit?.id === visit.id && (
                        <Box sx={{ ml: 4, mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                            Highlights:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {visit.highlights.map((highlight, idx) => (
                              <Chip
                                key={idx}
                                label={highlight}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: getCategoryColor(visit.category),
                                  color: getCategoryColor(visit.category),
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {index < selectedLocation.visits.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default Map;
