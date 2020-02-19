import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import NewBaseContent from './NewBaseContent.jsx'


export default function DialogAlert({ open, switchAlert, confirmAction, status, ...props }) {

    // const _renderDialogContent = () => {
    //     let info, title = "";
    //     switch (status) {
    //         case "create_base":
    //             title = "Dodawanie bazy"
    //             info = <NewBaseContent />
    //             break;
    //         case "create_vehicle":
    //             title = "Dodawanie pojazdu"
    //             // info = <NewVehicleContent />
    //             break;
    //         case "drop_base":
    //             title = "Czy na pewno chcesz usunąć tą bazę?"
    //             // info = selectedBase;
    //             break;
    //         case "drop_vehicle":
    //             title = "Czy na pewno chcesz usunąć ten pojazd? "
    //             break;
    //         case "info_base":
    //             // get info 
    //             break;
    //         case "info_vehicle":
    //             // get info 
    //             break;
    //         default:
    //             return;
    //     }

    //     return (
    //         <DialogAlert open={open} switchAlert={_switchAlert} confirmAction={_confirmAction} status={status}>
    //             <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    //             <DialogContent>
    //                 {info}
    //             </DialogContent>
    //         </DialogAlert>
    //     )
    // }


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
                    {/* <Button onClick={() => {
                        confirmAction()
                        switchAlert(false)
                    }} color="primary">
                        Zatwierdź
                </Button> */}
                    <Button onClick={() => switchAlert(false)} color="primary" autoFocus>
                        Anuluj
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}