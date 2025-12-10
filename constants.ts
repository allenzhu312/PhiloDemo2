import { Philosopher } from './types';

export const INITIAL_PHILOSOPHERS: Philosopher[] = [
  {
    id: 'socrates',
    name: 'Socrates',
    dates: 'c. 470 – 399 BC',
    school: 'Classical Greek',
    shortBio: 'The foundational figure of Western philosophy, known for the Socratic method and his contribution to ethics.',
    fullBio: 'Socrates was a classical Greek (Athenian) philosopher credited as one of the founders of Western philosophy. He is an enigmatic figure known chiefly through the accounts of classical writers, especially the writings of his students Plato and Xenophon. Through his portrayal in Plato\'s dialogues, Socrates has become renowned for his contribution to the field of ethics.',
    keyIdeas: ['Socratic Method', 'Socratic Irony', 'Virtue is Knowledge', 'The Unexamined Life is not worth living'],
    famousQuotes: [
      "The only true wisdom is in knowing you know nothing.",
      "The unexamined life is not worth living.",
      "Wonder is the beginning of wisdom."
    ],
    imageUrl: 'https://picsum.photos/id/1062/400/400',
    comments: [
      { id: 'c1', author: 'PlatoFan', text: 'His method changed how we think forever.', timestamp: 1678886400000 }
    ]
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    dates: '1844 – 1900',
    school: 'Existentialism / Nihilism',
    shortBio: 'A German philosopher whose work has exerted a profound influence on modern intellectual history.',
    fullBio: 'Friedrich Wilhelm Nietzsche was a German philosopher, cultural critic, composer, poet, writer, and philologist whose work has exerted a profound influence on modern intellectual history. He began his career as a classical philologist before turning to philosophy. He became the youngest person ever to hold the Chair of Classical Philology at the University of Basel in 1869 at the age of 24.',
    keyIdeas: ['Übermensch', 'Will to Power', 'Eternal Recurrence', 'God is Dead'],
    famousQuotes: [
      "He who has a why to live can bear almost any how.",
      "That which does not kill us makes us stronger.",
      "God is dead. God remains dead. And we have killed him."
    ],
    imageUrl: 'https://picsum.photos/id/1025/400/400',
    comments: []
  },
  {
    id: 'confucius',
    name: 'Confucius',
    dates: '551 – 479 BC',
    school: 'Confucianism',
    shortBio: 'A Chinese philosopher and politician of the Spring and Autumn period who is traditionally considered the paragon of Chinese sages.',
    fullBio: 'Confucius was a Chinese philosopher and politician of the Spring and Autumn period who is traditionally considered the paragon of Chinese sages. Confucius\'s teachings and philosophy underpin East Asian culture and society, remaining influential across China and East Asia to this day.',
    keyIdeas: ['Ren (Benevolence)', 'Li (Ritual)', 'Filial Piety', 'The Golden Rule'],
    famousQuotes: [
      "It does not matter how slowly you go as long as you do not stop.",
      "Everything has beauty, but not everyone sees it.",
      "Respect yourself and others will respect you."
    ],
    imageUrl: 'https://picsum.photos/id/1015/400/400',
    comments: []
  },
  {
    id: 'simone_de_beauvoir',
    name: 'Simone de Beauvoir',
    dates: '1908 – 1986',
    school: 'Existentialism / Feminism',
    shortBio: 'A French existentialist philosopher, writer, social theorist, and feminist activist.',
    fullBio: 'Simone de Beauvoir was a French existentialist philosopher, writer, social theorist, and feminist activist. Though she did not consider herself a philosopher, she had a significant influence on both feminist existentialism and feminist theory. She wrote novels, essays, biographies, autobiography and monographs on philosophy, politics, and social issues.',
    keyIdeas: ['The Second Sex', 'Ethics of Ambiguity', 'Existential Feminism'],
    famousQuotes: [
      "One is not born, but rather becomes, a woman.",
      "I am too intelligent, too demanding, and too resourceful for anyone to be able to take charge of me entirely."
    ],
    imageUrl: 'https://picsum.photos/id/1011/400/400',
    comments: []
  }
];