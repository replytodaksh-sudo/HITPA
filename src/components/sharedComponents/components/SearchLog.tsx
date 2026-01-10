import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useParams } from 'react-router-dom';
import { logService } from '../../../services/log.service';

interface LogItem {
  logTime: string;
  description: string;
  information: string;
}

interface LogsProps {
  data: any;
}

const SearchLog: React.FC<LogsProps> = ({ data }) => {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() +' ' + date.toLocaleTimeString();
  };

  return (
    <Box
      className="app-logs"
      sx={{
        p: 3,
      }}
    >
      <List sx={{ position: 'relative' }}>
        {data && data.map((item: any, index: number) => (
          <ListItem
            key={index}
            sx={{
              display: 'block',
              mb: 3,
              position: 'relative',
              paddingLeft: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '19px',
                top: '40px',
                bottom: '-24px',
                width: '2px',
                backgroundColor: index === data.length - 1 ? 'transparent' : '#e0e0e0',
              },
            }}
          >
            {/* Timeline Dot */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                boxShadow: '0 0 0 4px #fff, 0 0 0 6px rgba(103, 58, 183, 0.1)',
                animation: 'bounce-in 0.6s ease-in-out',
                '@keyframes bounce-in': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0.5)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                }}
              />
            </Box>

            {/* Content */}
            <Paper
              elevation={2}
              sx={{
                ml: 7,
                p: 3,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                animation: 'bounce-in 0.6s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Timestamp */}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mb: 2,
                  fontSize: '0.875rem',
                }}
              >
                {formatDate(item.logTime)}
              </Typography>

              {/* Log Content */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* Icon */}
                <Avatar
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <DescriptionIcon fontSize="medium" />
                </Avatar>

                {/* Text Content */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.information}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SearchLog;