import Button from "@mui/material/Button";
import React, { ReactNode, useEffect, useState } from "react";
import Layout from "../../components/common/layout";
import Grid from "@mui/material/Grid";
import PageHeader from "../../components/common/pageheader";
import {Tab, Tabs, Typography, Box} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {useRouter} from "next/router";
import Stepper from "../../components/moving/stepper";
import Link from "next/link";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import {useGet, useMutate} from "restful-react";
import {updateRequest} from "../../components/utility/RequestHandler";
import { useAppContext } from "../../components/context/state";
import { useUserContext } from "../../components/context/userContext";
import LoginScreen from "../../components/moving/loginScreen";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  calendarAlign: {
    [theme.breakpoints.up('md')]: {
      float: "left",
    },
  },
}));

function Index() {
  const classes = useStyles();
  const title = 'Gemeente \'s-Hertogenbosch | Verhuizing doorgeven';
  const router = useRouter();
  let request = null;
  let context = useAppContext();
  const userContext = useUserContext();

  const handleDate = (event) => {
    event.preventDefault();

    updateRequest(context, 'verhuisdatum', date.toISOString().split('T')[0])
    router.push("/moving/coMovers", undefined, {shallow: true})
  }

  const maxDateOfMoveObject = new Date();
  maxDateOfMoveObject.setDate(maxDateOfMoveObject.getDate() + 28);
  // let maxDateOfMove = maxDateOfMoveObject.toISOString().split('T')[0];

  const [date, setValue] = React.useState(new Date());

  return <>
  <Layout title={title} description="waar kan ik deze description zien">
    {
      userContext.user == null
        ?
        <LoginScreen />
        :
        <Grid container spacing={3}>
          <Stepper currentStep={1}/>

          <Grid item sm={12} xs={12} md={12}>
            <Typography variant="h4">
              Wanneer ga je verhuizen?
            </Typography>
            <Typography mb="10px">
              Kies je verhuisdatum in de onderstaande kalender. De verhuisdatum mag maximaal 28 dagen in de toekomst
              liggen.
            </Typography>
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            <form onSubmit={handleDate}>
              <Grid item sm={12} xs={12} md={12} className={classes.calendarAlign}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {
                    request != null && request.properties != null && request.properties.includes("datum") && request.properties.datum != null ?
                      <StaticDatePicker
                        minDate={new Date()}
                        maxDate={maxDateOfMoveObject}
                        displayStaticWrapperAs="desktop"
                        openTo="day"
                        value={request.properties.datum}
                        onChange={(newValue) => {
                          setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      /> :
                      <StaticDatePicker
                        minDate={new Date()}
                        maxDate={maxDateOfMoveObject}
                        displayStaticWrapperAs="desktop"
                        openTo="day"
                        value={date}
                        onChange={(newValue) => {
                          setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                  }
                </LocalizationProvider>
                <span style={{marginBottom: 20}}><p>Verhuisdatum: {date.toISOString().split('T')[0]}</p></span>
              </Grid>
              <br/>
              <Grid
                justifyContent="space-between" // Add it here :)
                container>
                <Grid item sm={6} xs={6} md={6}>
                  <Link href="/moving/address">
                    <Button variant="text" startIcon={<ChevronLeft/>}> Ga terug</Button>
                  </Link>
                </Grid>
                <Grid item sm={6} xs={6} md={6}>
                  <Button color="primary" type="submit" variant="contained" endIcon={<ChevronRight/>}>Ga verder</Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
    }
  </Layout>
</>
  ;
}

export default Index
