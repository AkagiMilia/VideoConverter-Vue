import pandas as pd
import numpy as np
import sqlite3

con = sqlite3.connect('src/data/database.db')
cur = con.cursor()

def load(path, index='name'):
    dataFrame = pd.read_csv(path,index_col=index)
    return dataFrame

def toDB(csvPath, tableName, con):
    df = load(csvPath)
    df.to_sql(tableName, con, if_exists='replace')

if __name__ == '__main__':
    toDB('src/data/libx265.csv', 'libx265', con)
    toDB('src/data/subValue.csv', 'subValue', con)
    toDB('src/data/libx264.csv', 'libx264', con)
    toDB('src/data/formats.csv', 'formats', con)
    # df = pd.read_sql_query("SELECT * FROM libx265", con)
    # print(df)

    # sql = '''
    # select explanation from subValue
    # where name = 'me';
    # '''
    # cur.execute(sql)
    # print(cur.fetchall()[0][0])

    cur.execute("select * from SQLite_master")
    for line in cur.fetchall():
        print(line)
