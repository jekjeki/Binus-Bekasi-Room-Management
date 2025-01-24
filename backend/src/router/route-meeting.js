const router = require('express').Router()
const data = require('../controller')

router.get('/get-all-meetings', data.data.getAllMeetings)
router.get('/get-detail-meeting/:meetingId', data.data.getDetailMeetingData)
router.put('/update-meeting/:meetingId', data.data.updateMeetingData)

module.exports = router