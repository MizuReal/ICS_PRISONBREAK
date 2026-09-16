import speaker1 from '../assets/Speaker1.png'
import speaker2 from '../assets/Speaker2.png'
import speaker3 from '../assets/Speaker3.png'

export const event = {
  num: 'W-03',
  title: 'WANTED',
  inviteLine: 'You are officially invited to',
  name: 'SOFTWARE & MOBILE APPLICATION DEVELOPMENT',
  blurb: 'Three names top the warden’s list — and yours is on it too.',
  date: 'DATE TBA',
  time: 'TIME TBA',
  venue: 'VENUE TBA',
  rsvp: 'RSVP TBA',
  deadline: 'Roll call closes before the yard goes dark — RSVP early',
  rsvpUrl: '#',
}

export const speakers = [
  {
    id: 'speaker1',
    slug: '1',
    num: '01',
    inviteCode: 'W-03-01',
    name: 'SPEAKER NAME ONE',
    aka: 'AKA · HANDLE TBA',
    role: 'ROLE / TITLE TBA',
    topic: 'TALK TITLE TBA',
    wantedFor: 'Turning wild ideas into shipped software',
    personalNote:
      'The warden has read every file in the block, and one name keeps coming up. You’re not here to serve time — you’re here to show the rest of us how it’s done.',
    rsvpUrl: '#',
    photo: speaker1,
  },
  {
    id: 'speaker2',
    slug: '2',
    num: '02',
    inviteCode: 'W-03-02',
    name: 'SPEAKER NAME TWO',
    aka: 'AKA · HANDLE TBA',
    role: 'ROLE / TITLE TBA',
    topic: 'TALK TITLE TBA',
    wantedFor: 'Building mobile apps the whole yard can use',
    personalNote:
      'Three names top the list and yours is underlined. Report to the yard, take the stand, and let the block hear how you build apps the whole yard can use.',
    rsvpUrl: '#',
    photo: speaker2,
  },
  {
    id: 'speaker3',
    slug: '3',
    num: '03',
    inviteCode: 'W-03-03',
    name: 'SPEAKER NAME THREE',
    aka: 'AKA · HANDLE TBA',
    role: 'ROLE / TITLE TBA',
    topic: 'TALK TITLE TBA',
    wantedFor: 'Escaping legacy code without tripping an alarm',
    personalNote:
      'This is not a cell assignment — it’s your call to the yard. The warden wants your story on the record, and the rest of us want to hear how you slip past legacy code without tripping a single alarm.',
    rsvpUrl: '#',
    photo: speaker3,
  },
]

export function getSpeaker(slug) {
  return speakers.find((speaker) => speaker.slug === slug)
}
