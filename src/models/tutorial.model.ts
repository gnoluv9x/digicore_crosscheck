import { ResultSetHeader } from 'mysql2';
import connection from '@/db';
import Tutorial, { ITutorialModel } from '@/types/tutorial.type';

class TutorialModel implements ITutorialModel {
  save(tutorial: Tutorial): Promise<Tutorial> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO tutorials (title, description, published) VALUES(?,?,?)',
        [tutorial.title, tutorial.description, tutorial.published ? true : false],
        (err, res) => {
          console.log('Debug_here res: ', res);
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((tutorial) => resolve(tutorial!))
              .catch(reject);
        },
      );
    });
  }
  async retrieveAll(searchParams: { title?: string; published?: boolean }): Promise<Tutorial[]> {
    let query: string = 'SELECT * FROM tutorials';
    let condition: string = '';

    if (searchParams?.published) {
      condition += 'published = TRUE';
    }

    if (searchParams?.title) {
      condition += `LOWER(title) LIKE '%${searchParams.title}%'`;
    }

    if (condition.length) query += ' WHERE ' + condition;
    console.log('============== Debug_here query ==============');
    console.dir(query, { depth: null });

    return new Promise((resolve, reject) => {
      connection.query<Tutorial[]>(query, (err, res) => {
        console.log('Debug_here res: ', res);
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  retrieveById(tutorialId: number): Promise<Tutorial | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<Tutorial[]>('SELECT * FROM tutorials WHERE id = ?', [tutorialId], (err, res) => {
        console.log('Debug_here res: ', res);
        if (err) reject(err);
        else resolve(res?.[0]);
      });
    });
  }
  update(tutorial: Tutorial): Promise<number> {
    const { id: tutorialId, ...restTutorial } = tutorial;
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE tutorials SET ? WHERE id = ?',
        [{ ...restTutorial }, tutorialId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        },
      );
    });
  }
  delete(tutorialId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM tutorials WHERE id = ?', [tutorialId], (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM tutorials', (err, res) => {
        if (err) reject(err);
        else resolve(res.affectedRows);
      });
    });
  }
}

export default new TutorialModel();
