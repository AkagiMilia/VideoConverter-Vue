import pandas as pd
import numpy as np
import sqlite3
import os
import json

con = sqlite3.connect('src/data/database.db')
cur = con.cursor()

def load(path, index='name'):
    dataFrame = pd.read_csv(path,index_col=index)
    return dataFrame

def toDB(csvPath, tableName, con):
    df = load(csvPath)
    df.to_sql(tableName, con, if_exists='replace')

def getGuidance(type='encoder', format='libx264'):
    result = os.popen('ffmpeg -h {0}={1}'.format(type,format))
    parameters = {}
    paraName = ''
    subValue = ''
    isStart = False
    for line in result.readlines():
        line = line.strip('\n')
        line = line.split(' ')
        line = list(filter(lambda x : x!='', line))
        print(line)
        if not isStart or not line:
            if len(line)>0 and line[-1] == 'AVOptions:':
                isStart = True
            continue
        name = line[0] if line else 0
        if name and name[0] == '-':
            paraName = name
            parameters[name] = {}
            parameters[name]['valueType'] = line[1][1:-1] if len(line)>1 else None
            parameters[name]['explanation'] = ' '.join(line[3:]) if len(line)>3 else None
        else:
            if 'subValues' not in parameters[paraName]:
                parameters[paraName]['subValues'] = {}
            parameters[paraName]['subValues'][name] = {}
            parameters[paraName]['subValues'][name]['value'] = line[1] if len(line)>1 else None
            parameters[paraName]['subValues'][name]['explanation'] = ' '.join(line[3:]) if len(line)>3 else None
    """ parameters = json.dumps(parameters, indent=4)
    print(parameters) """
    return parameters

        


if __name__ == '__main__':
    # toDB('src/data/libx265.csv', 'libx265', con)
    # toDB('src/data/subValue.csv', 'subValue', con)
    # toDB('src/data/libx264.csv', 'libx264', con)
    # toDB('src/data/formats.csv', 'formats', con)

    # df = pd.read_sql_query("SELECT * FROM libx265", con)
    # print(df)

    # sql = '''
    # select explanation from subValue
    # where name = 'me';
    # '''
    # cur.execute(sql)
    # print(cur.fetchall()[0][0])

    # cur.execute("select * from SQLite_master")
    # for line in cur.fetchall():
    #     print(line)
    f = open('src/data/Guidance.json','x',encoding='utf-8')
    guidance = {}
    guidance['libx264'] = getGuidance(format='libx264')
    guidance['libx265'] = getGuidance(format='libx265')
    guidance['libaom-av1'] = getGuidance(format='libaom-av1')
    guidance['flac'] = getGuidance(format='flac')
    guidance = json.dumps(guidance, indent=4)
    print(guidance)
    f.write(guidance)
    f.close()
