import crone from 'node-cron'
import Company from '../models/company'

export default () => {
    crone.schedule("0 0 8,12,16,20 * * *", async function () {
        
    })
}
