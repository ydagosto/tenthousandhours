'use client';
import { Box, Button, Typography, Container, useMediaQuery, useTheme } from '@mui/material';

export default function About() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const displayValue = isMobile ? 'absolute': 'flex'
    return (
        <Container maxWidth="lg" className='pb-20'>
            <Box sx={{ mt: 4, mb: 4 }}>
                
                <Typography variant="h4" component="h1" textOverflow={'ellipsis'} gutterBottom>
                    <strong>About tenthousandhours</strong>
                </Typography>
                
                <div style={{display:`${displayValue}`}}>
                    {/* Text Section */}
                    <div style={{textAlign:'justify'}}>
                        <Typography variant="body1" paragraph>
                            Welcome to <strong>tenthousandhours.net</strong>, a project I built to help track the hours you dedicate
                            to practicing your craft. The learning journey can be long and challenging, and sometimes it&apos;s easy
                            to forget how much time and effort you&apos;ve put in. Having a record to look back on not only helps you
                            stay committed but also serves as a reminder of how far you&apos;ve come.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The name <strong>tenthousandhours</strong> comes from the idea that it takes around 10,000 hours of practice to master a skill.
                            Whether you&apos;re learning an instrument, developing coding skills, or working on any other craft, it&apos;s
                            a long-term journey. This app is meant to help you track your progress and remind you that every
                            hour adds up toward your goal.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            When I was learning guitar, I used to keep a simple spreadsheet where I logged the dates and hours I
                            practiced each day. It became a personal motivator—I could see my improvement and feel proud of
                            staying accountable to my learning. Over time, those logged hours added up, giving me a sense of
                            accomplishment.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This project could have easily stayed as a spreadsheet, but I wanted something more user-friendly.
                            Pulling up Excel every time I practiced started to feel like a chore, and sometimes I&apos;d forget to
                            log hours altogether. That&apos;s why I decided to build <strong>tenthousandhours</strong>—a simple, clean app to make
                            tracking your practice hours easier.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Here&apos;s how it works:
                            <ul>
                                <li>Create an account.</li>
                                <li>Add an activity (like learning guitar, coding, or anything else you want to get better at).</li>
                                <li>Log your hours each day by clicking the plus button and entering the time you practiced.</li>
                            </ul>
                        </Typography>
                        <Typography variant="body1" paragraph>
                            There&apos;s no automated tracking here—this is all based on the honor system. If you add hours you haven&apos;t
                            actually practiced, you&apos;re only cheating yourself. This app is about building a habit, seeing progress,
                            and ultimately feeling proud of the time you&apos;ve invested in becoming better.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Thanks for using <strong>tenthousandhours</strong>—let&apos;s keep growing, one hour at a time!
                        </Typography>
                    </div>

                    {/* Screenshot Section */}
                    <div style={{
                        float:'right',
                        marginLeft: "10px",
                        width: '100%'
                        }}>
                        <Box
                            sx={{
                                width: '300px',
                                height: '600px',
                                backgroundColor: '#000',
                                borderRadius: '40px',
                                position: 'relative',
                                justify: 'center',
                                mx: 'auto',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60px',
                                    height: '5px',
                                    borderRadius: '10px',
                                    backgroundColor: '#333',
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '90px',
                                    height: '15px',
                                    borderRadius: '30px',
                                    backgroundColor: '#333',
                                },
                            }}
                        >
                            {/* Screenshot inside iPhone container */}
                            <Box
                                component="img"
                                src="/screenshot.png"
                                alt="tenthousandhours screenshot"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '40px',
                                }}
                            />
                        </Box>
                    </div>
                </div>
            </Box>
        </Container>
    );

}