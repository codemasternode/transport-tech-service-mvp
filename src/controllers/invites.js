import Invite from '../models/invites'
import { checkIsObjectHasOnlyAllowProperties, checkIsObjectHasRequiredProperties } from '../services/propertiesHelper'

export async function confirmInvitation(req, res) {
    res.send({})
    try {
        await Invite.updateOne({
            code: req.body.code
        }, { visited: true })
    } catch (err) {
        console.log(err)
    }
}