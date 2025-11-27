import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  RadioGroup,
  Radio,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { QuestionService } from '../../../services/question.service';

interface Question {
  questionCode: string;
  questionName: string;
  alreadyAdded: boolean;
}

interface QuestionnaireSectionProps {
  investigationId: string;
  selectedInsuredQuestions: string[];
  setSelectedInsuredQuestions: (codes: string[]) => void;
  selectedTreatingDoctorQuestions: string[];
  setSelectedTreatingDoctorQuestions: (codes: string[]) => void;
  customInsuredQuestions: string[];
  setCustomInsuredQuestions: (codes: string[]) => void;
  customTreatingDoctorQuestions: string[];
  setCustomTreatingDoctorQuestions: (codes: string[]) => void;
}

const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({
  investigationId,
  selectedInsuredQuestions,
  setSelectedInsuredQuestions,
  selectedTreatingDoctorQuestions,
  setSelectedTreatingDoctorQuestions,
  customInsuredQuestions,
  setCustomInsuredQuestions,
  customTreatingDoctorQuestions,
  setCustomTreatingDoctorQuestions,
}) => {
  const MAX_QUESTIONS = 15;

  // Modal states
  const [insuredBankOpen, setInsuredBankOpen] = useState(false);
  const [treatingDoctorBankOpen, setTreatingDoctorBankOpen] = useState(false);
  const [customInsuredOpen, setCustomInsuredOpen] = useState(false);
  const [customTreatingDoctorOpen, setCustomTreatingDoctorOpen] = useState(false);
  const [deleteInsuredOpen, setDeleteInsuredOpen] = useState(false);
  const [deleteTreatingDoctorOpen, setDeleteTreatingDoctorOpen] = useState(false);
  const [viewInsuredOpen, setViewInsuredOpen] = useState(false);
  const [viewTreatingDoctorOpen, setViewTreatingDoctorOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Question banks
  const [insuredQuestions, setInsuredQuestions] = useState<Question[]>([]);
  const [treatingDoctorQuestions, setTreatingDoctorQuestions] = useState<Question[]>([]);

  // Custom question forms
  const [customInsuredForms, setCustomInsuredForms] = useState<Array<{ questionName: string; questionIsCustom: boolean }>>([
    { questionName: '', questionIsCustom: false },
  ]);
  const [customTreatingDoctorForms, setCustomTreatingDoctorForms] = useState<Array<{ questionName: string; questionIsCustom: boolean }>>([
    { questionName: '', questionIsCustom: false },
  ]);

  // Custom question names for view modal
  const [insuredCustomQuestionsNames, setInsuredCustomQuestionsNames] = useState<string[]>([]);
  const [treatingDoctorCustomQuestionsNames, setTreatingDoctorCustomQuestionsNames] = useState<string[]>([]);

  // Download modal
  const [downloadType, setDownloadType] = useState('');

  // Counts
  const insuredCount = selectedInsuredQuestions.length + customInsuredQuestions.length;
  const treatingDoctorCount = selectedTreatingDoctorQuestions.length + customTreatingDoctorQuestions.length;

  useEffect(() => {
    fetchInsuredQuestions();
    fetchTreatingDoctorQuestions();
  }, [investigationId]);

  // Fetch insured questions
  const fetchInsuredQuestions = async () => {
    try {
      const response:any = await QuestionService.getQuestions('CO0115', investigationId);
      if (response.statusCode === 0) {
        setInsuredQuestions(response.payload.questionResponseDTOs || []);
        
        // Load custom questions if any
        if (response.payload.customQuestionResponseDTOs) {
          const customNames = response.payload.customQuestionResponseDTOs.map((q: any) => q.questionName);
          const customCodes = response.payload.customQuestionResponseDTOs.map((q: any) => q.questionCode);
          setInsuredCustomQuestionsNames(customNames);
          setCustomInsuredQuestions(customCodes);
        }

        // Pre-select already added questions
        const alreadyAdded = response.payload.questionResponseDTOs
          ?.filter((q: Question) => q.alreadyAdded)
          .map((q: Question) => q.questionCode) || [];
        setSelectedInsuredQuestions(alreadyAdded);
      }
    } catch (error) {
      console.error('Error fetching insured questions:', error);
    }
  };

  // Fetch treating doctor questions
  const fetchTreatingDoctorQuestions = async () => {
    try {
      const response = await QuestionService.getQuestions('CO0116', investigationId);
      console.log("000000000", response)
      if (response.statusCode === 0) {
        setTreatingDoctorQuestions(response.payload.questionResponseDTOs || []);
        if (response.payload.customQuestionResponseDTOs) {
          const customNames = response.payload.customQuestionResponseDTOs.map((q: any) => q.questionName);
          const customCodes = response.payload.customQuestionResponseDTOs.map((q: any) => q.questionCode);
          setTreatingDoctorCustomQuestionsNames(customNames);
          setCustomTreatingDoctorQuestions(customCodes);
        }

        const alreadyAdded = response.payload.questionResponseDTOs
          ?.filter((q: Question) => q.alreadyAdded)
          .map((q: Question) => q.questionCode) || [];
        setSelectedTreatingDoctorQuestions(alreadyAdded);
      }
    } catch (error) {
      console.error('Error fetching treating doctor questions:', error);
    }
  };

  // Handle insured question toggle
  const handleInsuredQuestionToggle = (questionCode: string, question: Question) => {
    if (question.alreadyAdded) return; // Can't uncheck already added
    
    if (selectedInsuredQuestions.includes(questionCode)) {
      setSelectedInsuredQuestions(selectedInsuredQuestions.filter((code) => code !== questionCode));
    } else {
      if (insuredCount < MAX_QUESTIONS) {
        setSelectedInsuredQuestions([...selectedInsuredQuestions, questionCode]);
      }
    }
  };

  // Handle treating doctor question toggle
  const handleTreatingDoctorQuestionToggle = (questionCode: string, question: Question) => {
    if (question.alreadyAdded) return;
    
    if (selectedTreatingDoctorQuestions.includes(questionCode)) {
      setSelectedTreatingDoctorQuestions(selectedTreatingDoctorQuestions.filter((code) => code !== questionCode));
    } else {
      if (treatingDoctorCount < MAX_QUESTIONS) {
        setSelectedTreatingDoctorQuestions([...selectedTreatingDoctorQuestions, questionCode]);
      }
    }
  };

  // Add custom insured question row
  const addCustomInsuredRow = () => {
    if (insuredCount < MAX_QUESTIONS) {
      setCustomInsuredForms([...customInsuredForms, { questionName: '', questionIsCustom: false }]);
    }
  };

  // Delete custom insured question row
  const deleteCustomInsuredRow = (index: number) => {
    const newForms = customInsuredForms.filter((_, i) => i !== index);
    setCustomInsuredForms(newForms);
  };

  // Add custom treating doctor question row
  const addCustomTreatingDoctorRow = () => {
    if (treatingDoctorCount < MAX_QUESTIONS) {
      setCustomTreatingDoctorForms([...customTreatingDoctorForms, { questionName: '', questionIsCustom: false }]);
    }
  };

  // Delete custom treating doctor question row
  const deleteCustomTreatingDoctorRow = (index: number) => {
    const newForms = customTreatingDoctorForms.filter((_, i) => i !== index);
    setCustomTreatingDoctorForms(newForms);
  };

  // Submit custom insured questions
  const handleSubmitCustomInsured = async () => {
    const validQuestions = customInsuredForms.filter((q) => q.questionName.trim());
    if (validQuestions.length === 0) {
      alert('Please enter at least one question');
      return;
    }

    try {
      const payload = {
        questionTypeCode: 'CO0115',
        questions: validQuestions,
      };

      const response:any = await QuestionService.addQuestion(payload);
      if (response.data.statusCode === 0) {
        const newCodes = response.data.payload;
        const newNames = validQuestions.map((q) => q.questionName);
        
        setCustomInsuredQuestions([...customInsuredQuestions, ...newCodes]);
        setInsuredCustomQuestionsNames([...insuredCustomQuestionsNames, ...newNames]);
        setCustomInsuredOpen(false);
        setCustomInsuredForms([{ questionName: '', questionIsCustom: false }]);
        alert('Custom questions added successfully');
      }
    } catch (error) {
      console.error('Error adding custom questions:', error);
      alert('Failed to add custom questions');
    }
  };

  // Submit custom treating doctor questions
  const handleSubmitCustomTreatingDoctor = async () => {
    const validQuestions = customTreatingDoctorForms.filter((q) => q.questionName.trim());
    if (validQuestions.length === 0) {
      alert('Please enter at least one question');
      return;
    }

    try {
      const payload = {
        questionTypeCode: 'CO0116',
        questions: validQuestions,
      };

      const response:any = await QuestionService.addQuestion(payload);
      if (response.data.statusCode === 0) {
        const newCodes = response.data.payload;
        const newNames = validQuestions.map((q) => q.questionName);
        
        setCustomTreatingDoctorQuestions([...customTreatingDoctorQuestions, ...newCodes]);
        setTreatingDoctorCustomQuestionsNames([...treatingDoctorCustomQuestionsNames, ...newNames]);
        setCustomTreatingDoctorOpen(false);
        setCustomTreatingDoctorForms([{ questionName: '', questionIsCustom: false }]);
        alert('Custom questions added successfully');
      }
    } catch (error) {
      console.error('Error adding custom questions:', error);
      alert('Failed to add custom questions');
    }
  };

  // Delete all custom insured questions
  const handleDeleteInsuredCustom = () => {
    setCustomInsuredQuestions([]);
    setInsuredCustomQuestionsNames([]);
    setDeleteInsuredOpen(false);
  };

  // Delete all custom treating doctor questions
  const handleDeleteTreatingDoctorCustom = () => {
    setCustomTreatingDoctorQuestions([]);
    setTreatingDoctorCustomQuestionsNames([]);
    setDeleteTreatingDoctorOpen(false);
  };

  // Download questionnaire PDF
  const handleDownloadPDF = async () => {
    if (!downloadType) {
      alert('Please select a questionnaire type');
      return;
    }

    try {
      await QuestionService.downloadQuestion(investigationId, downloadType);
      const url = `/api/questions/download/${investigationId}?questionType=${downloadType}`;
      window.open(url, '_blank');
      setDownloadModalOpen(false);
      setDownloadType('');
    } catch (error) {
      console.error('Error downloading questionnaire:', error);
      alert('Failed to download questionnaire');
    }
  };

  return (
    <>
      <Card sx={{ mb: 3, bgcolor: '#f0f8ff' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Questionnaire for investigation <span style={{ color: 'red' }}>*</span>
          </Typography>

          {/* For Insured Section */}
          <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
            <Grid size={{ xs: 2 }}>
              <Typography>For Insured</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="text"
                onClick={() => setInsuredBankOpen(true)}
                sx={{ textTransform: 'none', color: 'blue' }}
              >
                Add from question bank
              </Button>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Typography>{selectedInsuredQuestions.length} selected</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="text"
                onClick={() => setCustomInsuredOpen(true)}
                sx={{ textTransform: 'none', color: 'blue' }}
                disabled={insuredCount >= MAX_QUESTIONS}
              >
                Add custom question
              </Button>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="text"
                onClick={() => setViewInsuredOpen(true)}
                sx={{ textTransform: 'none', color: 'blue' }}
              >
                {customInsuredQuestions.length} selected
              </Button>
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'right' }}>
              <IconButton size="small" onClick={() => setDeleteInsuredOpen(true)}>
                <DeleteIcon sx={{ color: 'red' }} />
              </IconButton>
              <IconButton size="small" onClick={() => setDownloadModalOpen(true)}>
                <DownloadIcon sx={{ color: '#30c7ec' }} />
              </IconButton>
            </Grid>
          </Grid>

          {/* For Treating Doctor Section */}
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 2 }}>
              <Typography>For Treating Doctor</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="text"
                onClick={() => setTreatingDoctorBankOpen(true)}
                sx={{ textTransform: 'none', color: 'blue' }}
              >
                Add from question template
              </Button>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Typography>{selectedTreatingDoctorQuestions.length} selected</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="text"
                onClick={() => setCustomTreatingDoctorOpen(true)}
                sx={{ textTransform: 'none', color: 'blue' }}
                disabled={treatingDoctorCount >= MAX_QUESTIONS}
              >
                Add custom question
              </Button>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="text"
                onClick={() => setViewTreatingDoctorOpen(true)}
                sx={{ textTransform: 'none', color: 'blue' }}
              >
                {customTreatingDoctorQuestions.length} selected
              </Button>
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'right' }}>
              <IconButton size="small" onClick={() => setDeleteTreatingDoctorOpen(true)}>
                <DeleteIcon sx={{ color: 'red' }} />
              </IconButton>
              <IconButton size="small" onClick={() => setDownloadModalOpen(true)}>
                <DownloadIcon sx={{ color: '#30c7ec' }} />
              </IconButton>
            </Grid>
          </Grid>

          {insuredCount >= MAX_QUESTIONS && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Maximum of {MAX_QUESTIONS} questions reached for Insured
            </Alert>
          )}
          {treatingDoctorCount >= MAX_QUESTIONS && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Maximum of {MAX_QUESTIONS} questions reached for Treating Doctor
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Modal: For Insured Questions Bank */}
      <Dialog open={insuredBankOpen} onClose={() => setInsuredBankOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          For Insured Questions
          <IconButton
            onClick={() => setInsuredBankOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '60vh' }}>
          {insuredQuestions.map((question) => (
            <FormControlLabel
              key={question.questionCode}
              control={
                <Checkbox
                  checked={
                    question.alreadyAdded ||
                    selectedInsuredQuestions.includes(question.questionCode)
                  }
                  onChange={() => handleInsuredQuestionToggle(question.questionCode, question)}
                  disabled={question.alreadyAdded || (insuredCount >= MAX_QUESTIONS && !selectedInsuredQuestions.includes(question.questionCode))}
                />
              }
              label={question.questionName}
              sx={{ display: 'block', mb: 1 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInsuredBankOpen(false)} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: For Treating Doctor Questions Bank */}
      <Dialog open={treatingDoctorBankOpen} onClose={() => setTreatingDoctorBankOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Treating Doctor Insured Questions
          <IconButton
            onClick={() => setTreatingDoctorBankOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '60vh' }}>
          {treatingDoctorQuestions.map((question) => (
            <FormControlLabel
              key={question.questionCode}
              control={
                <Checkbox
                  checked={
                    question.alreadyAdded ||
                    selectedTreatingDoctorQuestions.includes(question.questionCode)
                  }
                  onChange={() => handleTreatingDoctorQuestionToggle(question.questionCode, question)}
                  disabled={question.alreadyAdded || (treatingDoctorCount >= MAX_QUESTIONS && !selectedTreatingDoctorQuestions.includes(question.questionCode))}
                />
              }
              label={question.questionName}
              sx={{ display: 'block', mb: 1 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTreatingDoctorBankOpen(false)} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Add Custom Insured Questions */}
      <Dialog open={customInsuredOpen} onClose={() => setCustomInsuredOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Custom Question
          <IconButton
            onClick={() => setCustomInsuredOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell align="center">Add Question to Bank</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customInsuredForms.map((form, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={form.questionName}
                      onChange={(e) => {
                        const newForms = [...customInsuredForms];
                        newForms[index].questionName = e.target.value;
                        setCustomInsuredForms(newForms);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={form.questionIsCustom}
                      onChange={(e) => {
                        const newForms = [...customInsuredForms];
                        newForms[index].questionIsCustom = e.target.checked;
                        setCustomInsuredForms(newForms);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={addCustomInsuredRow}
                      disabled={insuredCount >= MAX_QUESTIONS}
                    >
                      +Add
                    </Button>
                    {customInsuredForms.length > 1 && (
                      <Button size="small" onClick={() => deleteCustomInsuredRow(index)}>
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitCustomInsured} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Add Custom Treating Doctor Questions */}
      <Dialog open={customTreatingDoctorOpen} onClose={() => setCustomTreatingDoctorOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Custom Question
          <IconButton
            onClick={() => setCustomTreatingDoctorOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell align="center">Add Question to Bank</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customTreatingDoctorForms.map((form, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={form.questionName}
                      onChange={(e) => {
                        const newForms = [...customTreatingDoctorForms];
                        newForms[index].questionName = e.target.value;
                        setCustomTreatingDoctorForms(newForms);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={form.questionIsCustom}
                      onChange={(e) => {
                        const newForms = [...customTreatingDoctorForms];
                        newForms[index].questionIsCustom = e.target.checked;
                        setCustomTreatingDoctorForms(newForms);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={addCustomTreatingDoctorRow}
                      disabled={treatingDoctorCount >= MAX_QUESTIONS}
                    >
                      +Add
                    </Button>
                    {customTreatingDoctorForms.length > 1 && (
                      <Button size="small" onClick={() => deleteCustomTreatingDoctorRow(index)}>
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitCustomTreatingDoctor} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Delete Insured Custom Questions */}
      <Dialog open={deleteInsuredOpen} onClose={() => setDeleteInsuredOpen(false)}>
        <DialogTitle>Delete Custom Question</DialogTitle>
        <DialogContent>
          <Typography>Are you sure to delete the custom questions?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteInsuredOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteInsuredCustom} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Delete Treating Doctor Custom Questions */}
      <Dialog open={deleteTreatingDoctorOpen} onClose={() => setDeleteTreatingDoctorOpen(false)}>
        <DialogTitle>Delete Custom Question</DialogTitle>
        <DialogContent>
          <Typography>Are you sure to delete the custom questions?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTreatingDoctorOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTreatingDoctorCustom} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: View Insured Custom Questions */}
      <Dialog open={viewInsuredOpen} onClose={() => setViewInsuredOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          View Insured Custom Question
          <IconButton
            onClick={() => setViewInsuredOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insuredCustomQuestionsNames.map((question, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{question}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {insuredCustomQuestionsNames.length === 0 && (
            <Typography align="center" sx={{ py: 2 }}>
              No custom questions added
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewInsuredOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: View Treating Doctor Custom Questions */}
      <Dialog open={viewTreatingDoctorOpen} onClose={() => setViewTreatingDoctorOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          View Treating Doctor Custom Question
          <IconButton
            onClick={() => setViewTreatingDoctorOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treatingDoctorCustomQuestionsNames.map((question, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{question}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {treatingDoctorCustomQuestionsNames.length === 0 && (
            <Typography align="center" sx={{ py: 2 }}>
              No custom questions added
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTreatingDoctorOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Download Questionnaire */}
      <Dialog open={downloadModalOpen} onClose={() => setDownloadModalOpen(false)}>
        <DialogTitle>
          Questionnaire
          <IconButton
            onClick={() => setDownloadModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <RadioGroup value={downloadType} onChange={(e) => setDownloadType(e.target.value)}>
            <FormControlLabel
              value="ForInsured"
              control={<Radio />}
              label="For Insured"
            />
            <FormControlLabel
              value="ForTreatingDoctor"
              control={<Radio />}
              label="For Treating Doctor"
            />
          </RadioGroup>
          {downloadType && (
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleDownloadPDF} variant="outlined">
                Download
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionnaireSection;