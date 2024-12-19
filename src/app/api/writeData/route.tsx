import { db, collection, addDoc } from '@/firebase';

interface Subject {
  subject: string;
  score: number;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const data: Subject[] = await req.json();
    const subjectCollection = collection(db, 'subjects');
    const docIds = await Promise.all(
      data.map(async (user) => {
        const docRef = await addDoc(subjectCollection, user);
        return docRef.id;
      })
    );
    return new Response(JSON.stringify({ docIds }), { status: 200 });
  } catch (error) {
    console.error('Error adding document: ', error);
    return new Response(JSON.stringify({ error: 'Error adding document' }), {
      status: 500,
    });
  }
}
