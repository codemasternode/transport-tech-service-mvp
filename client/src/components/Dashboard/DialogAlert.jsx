import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';


export default function DialogAlert({ open, switchAlert, confirmAction, ...props }) {

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => switchAlert(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {props.children}
                <DialogActions>
                    <Button onClick={() => {
                        confirmAction()
                        switchAlert(false)
                    }} color="primary">
                        Zatwierdź
                </Button>
                    <Button onClick={() => switchAlert(false)} color="primary" autoFocus>
                        Anuluj
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}