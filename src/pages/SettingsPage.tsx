import React from "react";
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu';
import { Grid } from '@mui/material';
import Settings from "../components/Settings/SettingsView";

function SettingsPage() {
    return (
        <div>
            <Grid container spacing={0}>
            <Grid xs={0.5} md={0.5}>
              <NavigationMenu />
            </Grid>
            <Settings></Settings>
            </Grid>
        </div>
    )

}

export default SettingsPage;