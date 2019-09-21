import React, { useEffect, useRef } from 'react';
import { CssBaseline, Card, CardContent, CardHeader, Grid, Typography, Container, Collapse, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import tiers from '../../utils/tiers';
import { withRouter } from "react-router-dom";
import axios from 'axios';


const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            height: '100%'
        },
        ul: {
            margin: 0,
            padding: 0,
        },
        li: {
            listStyle: 'none',
        },
    },
    root: {
        height: '100vh',
        background: 'linear-gradient(top, #f2f2f2 70%, #232f3e 30%)',
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    image: {
        width: '100%',
        height: 'auto',
        margin: 'auto',
        transition: theme.transitions.create('width', {
            duration: 300,
        }),
    },
    container: {
        height: '55vh',
    },
    imageDiv: {
        height: 'auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor: '#ff9900',
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    button: {
        backgroundColor: '#ff9900',
    }
}));



export default withRouter(({ history, data, handleChoosePlan }) => {
    // console.log(props)
    const classes = useStyles();
    const [visible, setVisible] = React.useState({
        checked1: false,
        checked2: false,
        checked3: false,
        waitForRes: false,
    });
    const [valid, setValid] = React.useState({
        num: 0,
        checked: false,
    })
    const root = useRef(null)
    useEffect(() => {
        if (root.current.clientWidth <= 566) {
            setVisible({
                ...visible,
                checked1: true,
                checked2: true,
                checked3: true,
            })
        } else {
            setVisible({
                ...visible,
                checked1: false,
                checked2: false,
                checked3: false,
            })

        }
    }, [])

    const returnImage = key => {
        if (key === 0) {
            return visible.checked1
        } else if (key === 1) {
            return visible.checked2
        } else {
            return visible.checked3
        }
    }


    const selectProduct = key => {
        if (key === 0) {
            setVisible({ ...visible, checked1: true, checked2: false, checked3: false })
            setValid({ valid: true, num: 0 })

        } else if (key === 1) {
            setVisible({ ...visible, checked2: true, checked1: false, checked3: false })
            setValid({ valid: true, num: 1 })
        } else {
            setVisible({ ...visible, checked3: true, checked2: false, checked1: false })
            setValid({ valid: true, num: 2 })
        }
        console.log(valid)
    }

    const nextStep = () => {
        setVisible({ ...visible, waitForRes: true, })
        // axios.post('/api/newEmployee', { data: data.plan }).then((response) => {
        //     setVisible({ ...visible, waitForRes: false, })
        // }, (err) => {
        //     console.log(err)
        // })
        history.push('/database-dashboard')
    }

    return (
        <div className={classes.root} ref={root}>
            <CssBaseline />
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    <img src="../../logo.png" alt="logo" style={{ width: '60px' }} />
                </Typography>
                <Typography component="h3" variant="h4" align="center" color="textPrimary" gutterBottom>
                    Pricing
                </Typography>
            </Container>
            <Container maxWidth="md" component="main" className="mt-50">
                <Grid container spacing={5} alignItems="flex-end" style={{ minHeight: '55vh', margin: 0 }}>
                    {tiers.map((tier, key) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
                            <Card onMouseOver={() => {
                                if (key === 0) {
                                    setVisible({ ...visible, checked1: true })
                                } else if (key === 1) {
                                    setVisible({ ...visible, checked2: true })
                                } else {
                                    setVisible({ ...visible, checked3: true })
                                }
                            }}
                                onMouseLeave={() => {
                                    if (valid.valid && valid.num === 0) {
                                        setVisible({ ...visible, checked1: true, checked3: false, checked2: false })
                                    } else if (valid.valid && valid.num === 1) {
                                        setVisible({ ...visible, checked2: true, checked1: false, checked3: false })
                                    } else if (valid.valid && valid.num === 2) {
                                        setVisible({ ...visible, checked3: true, checked1: false, checked2: false })
                                    } else {
                                        setVisible({ ...visible, checked1: false, checked2: false, checked3: false })
                                    }
                                    // selectProduct(key) 
                                }}
                                onClick={() => {
                                    selectProduct(key)
                                    handleChoosePlan(key)
                                }}
                                // style={valid.valid && valid.num === key ? { transform: 'scale(1.1)', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.9),0px 1px 1px 0px rgba(0,0,0,0.44),0px 2px 1px -1px rgba(0,0,0,0.42)' } : { transform: 'scale(1)' }}
                                style={data.plan === tier.title ? { transform: 'scale(1.07)', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.9),0px 1px 1px 0px rgba(0,0,0,0.44),0px 2px 1px -1px rgba(0,0,0,0.42)' } : { transform: 'scale(1)' }}
                            >
                                <CardContent style={{ minHeight: '100%' }}>
                                    <div className={classes.cardPricing}>
                                        <Typography component="h2" variant="h3" color="textPrimary">
                                            zł{tier.price}
                                        </Typography>
                                        <Typography variant="h6" color="textSecondary">
                                            /mo
                                        </Typography>
                                    </div>
                                    <div className={classes.imageDiv}>
                                        <img className={classes.image} style={returnImage(key) ? { width: "50%" } : { width: "100%" }} src={tier.img} alt="img" />
                                    </div>
                                    <Collapse in={key === 0 ? visible.checked1 : (key === 1 ? visible.checked2 : visible.checked3)} className={classes.collapse}>
                                        <ul>
                                            {tier.description.map(line => (
                                                <Typography component="li" variant="subtitle1" align="center" key={line}>
                                                    {line}
                                                </Typography>
                                            ))}
                                        </ul>

                                    </Collapse>
                                </CardContent>
                                <CardHeader
                                    title={tier.title}
                                    subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <div >
                    <Button variant="contained" className={classes.button} onClick={nextStep}>
                        Dalej
                    </Button>
                </div>
            </Container>
        </div>
    );
})