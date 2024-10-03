import { google } from 'googleapis'

export async function fetchSchools(sheetID) {
  const googleAuth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth: googleAuth })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: 'Database!A2:Z1000',
    majorDimension: 'ROWS',
  })

  const schools = response.data.values.map((school) => {
    return {
      name: school[1] ? school[1] : '',
      counselor_name: school[2] ? school[2] : '',
      counselor_email: school[3] ? school[3] : '',
      counselor_phone: school[4] ? school[4] : '',
      contact_point: school[5] ? school[5] : '',
      preferred_time: school[6] ? school[6] : '',
      profile: school[7] ? school[7] : '',
      website: school[8] ? school[8] : '',
      calendar: school[9] ? school[9] : '',
      pic: school[10] ? school[10] : '',
      logo: school[11] ? school[11] : '',
      address: school[12] ? school[12] : '',
      latitude: school[13] ? school[13] : '',
      longitude: school[14] ? school[14] : '',
    }
  })

  return schools
}
