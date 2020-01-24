import Invite from '../models/invites'

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