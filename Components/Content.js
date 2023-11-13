import { useState } from 'react'
import { TextField, Container, Grid, Box, Button, ThemeProvider, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { createTheme } from '@mui/material/styles'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Skeleton from '@mui/material/Skeleton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip';

import i18n, { use } from 'i18next'
import { useTranslation, initReactI18next } from 'react-i18next';

const changeLanguage = (lang) => {
    i18n.use(initReactI18next).init({
        resources: {
            vn: {
                translation: {
                    'Analyze type': 'Kiểu phân tích',
                    'Analyze nouns': 'Phân tích danh từ',
                    'Analyze verbs': 'Phân tích động từ',
                    'Analyze adjectives': 'Phân tích tính từ',
                    'Enter paragraph': 'Nhập đoạn văn',
                    'Input something to see the value...✨': 'Nhập nội dung nào đó để xem kết quả...✨',
                    'Select analyze type please!': 'Hãy chọn kiểu phân tích bạn muốn!',
                    'Input something to analyze please!': 'Vui lòng nhập nội dung nào đó để phân tích!',
                    'Vietnamese': 'Tiếng Việt',
                    'English': 'Tiếng Anh',
                    'Japanese': 'Tiếng nhật',
                    'characters': 'ký tự'
                }
            },
            ja: {
                translation: {
                    'Analyze type': '分析タイプ',
                    'Analyze nouns': '名詞を分析する',
                    'Analyze verbs': '動詞を分析する',
                    'Analyze adjectives': '形容詞を分析する',
                    'Enter paragraph': '段落を入力してください',
                    'Input something to see the value...✨': '何かを入力すると値が表示されます...✨',
                    'Select analyze type please!': '分析タイプを選択してください。',
                    'Input something to analyze please!': '分析したいものを入力してください。',
                    'Vietnamese': 'ベトナム語',
                    'English': '英語',
                    'Japanese': '日本語',
                    'characters': 'キトゥ'
                }
            },
        },
        lng: lang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })
}

const token = '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'

async function callAPIChatGPT(topic, paragraph) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                'model': 'gpt-3.5-turbo',
                'messages': [{ "role": "user", "content": `${topic}: ${paragraph}` }],
            })
        });

        const data = await response.json();
        console.log(data);
        return data.choices[0].message.content;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const theme = createTheme({
    palette: {
        redEarth: {
            main: '#b73939',
            light: '#b73939',
            dark: '#faabc7',
            contrastText: '#faabc7',
        },
    },
});

const analyzeTypes = ['Analyze nouns', 'Analyze verbs', 'Analyze adjectives']

changeLanguage('en')

const Content = () => {
    const { t } = useTranslation()

    const [paragraph, setParagraph] = useState('')
    const [result, setResult] = useState('Input something to see the value...✨')
    const [analyzeType, setAnalyzeType] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [numChar, setNumChar] = useState(0)
    const [validParagraph, setValidParagraph] = useState(false)

    const handleChatGPT = () => {
        if (!analyzeType) {
            setError('Select analyze type please!')
        }

        if (!paragraph) {
            setError('Input something to analyze please!')
        }

        if (paragraph && analyzeType) {
            if (paragraph.length < 100 || paragraph.length > 500) {
                setError('Required paragraph length is minimum 100 and maximum 500 characters!')
            } else {
                console.warn('CALL API')
                setLoading(true)
                setResult('')
                setError('')
                if (analyzeType === 'Analyze nouns') {
                    callAPIChatGPT('List the nouns in the following passage: ', paragraph)
                        .then(res => {
                            setResult(`List nouns from the paragraph: ${res}`)
                            setLoading(false)
                        })
                        .catch(error => {
                            setError('Something error try again!')
                        });
                } else if (analyzeType === 'Analyze verbs') {
                    callAPIChatGPT('List the verbs in the following passage: ', paragraph)
                        .then(res => {
                            setResult(`List verbs from the paragraph: ${res}`)
                            setLoading(false)
                        })
                        .catch(error => {
                            setError('Something error try again!')
                        });
                } else if (analyzeType === 'Analyze adjectives') {
                    callAPIChatGPT('List the adjectives in the following passage: ', paragraph)
                        .then(res => {
                            setResult(`List adjectives from the paragraph: ${res}`)
                            setLoading(false)
                        })
                        .catch(error => {
                            setError('Something error try again!')
                        });
                } else {
                    setResult('Something error try again!')
                }
            }
        }
    }

    const handleChangeTextField = (e) => {
        setParagraph(e.target.value)
        setNumChar(e.target.value.length)
        if (e.target.value.length >= 100 && e.target.value.length <= 500) {
            setValidParagraph(true)
        } else {
            setValidParagraph(false)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container style={{ padding: '1rem', justifyContent: 'space-between' }}>
                {error && (<Alert severity="warning" sx={{ marginBottom: '1rem' }}>{t(error)}</Alert>)}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) => changeLanguage(e.target.value)}
                        >
                            <FormControlLabel value="en" control={<Radio color="redEarth" />} label={t('English')} />
                            <FormControlLabel value="vn" control={<Radio color="redEarth" />} label={t('Vietnamese')} />
                            <FormControlLabel value="ja" control={<Radio color="redEarth" />} label={t('Japanese')} />
                        </RadioGroup>
                    </FormControl>
                    <FormControl sx={{ minWidth: 220 }} size="small">
                        <InputLabel color='redEarth' id="demo-simple-select-label">{t('Analyze type')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={analyzeType}
                            label="Analyze type"
                            onChange={(e) => setAnalyzeType(e.target.value)}
                            color='redEarth'
                        >
                            {analyzeTypes.map((type, index) => {
                                return (
                                    <MenuItem value={type} key={index}>{t(type)}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <Box style={{ marginTop: '1rem' }}>
                    <Grid container spacing={1} style={{ paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={11}>
                            <TextField
                                label={t('Enter paragraph')}
                                multiline
                                maxRows={10}
                                style={
                                    { width: '100%' }
                                }
                                color="redEarth"
                                value={paragraph}
                                onChange={handleChangeTextField}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            {loading ? <CircularProgress color="redEarth" /> :
                                <Button
                                    variant="contained"
                                    style={
                                        { backgroundColor: '#b73939' }
                                    }
                                    onClick={handleChatGPT}
                                    disabled={loading}
                                >
                                    <SendIcon />
                                </Button>}
                        </Grid>
                    </Grid>
                    {validParagraph ? 
                    <Chip label={`${numChar} ${t('characters')}`} color='success' /> 
                    : <Chip label={`${numChar} ${t('characters')}`} color='redEarth' style={{color: 'white'}}/>
                    }
                </Box>
                <Box style={{ marginTop: '2rem', fontSize: 'larger', border: '2px solid #cecdc8', padding: '1rem', 'borderRadius': '0.6rem' }}>
                    {t(result) || (
                        <div>
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                        </div>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Content