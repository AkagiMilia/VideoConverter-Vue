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

def getEncoders():
    result = os.popen('ffmpeg -encoders')
    encoders = {}
    videos = {}
    audios = {}
    subtitles = {}
    isStart = False
    for line in result.readlines():
        line = line.strip('\n')
        line = line.split(' ')
        line = list(filter(lambda x : x!='', line))
        if not isStart or not line:
            if len(line)>0 and line[0] == '------':
                isStart = True
            continue
        encoderName = line[1]
        explanation = ' '.join(line[2:])
        if line[0][0] == 'V':
            videos[encoderName] = {'explanation':explanation}
        elif line[0][0] == 'A':
            audios[encoderName] = {'explanation':explanation}
        else:
            subtitles[encoderName] = {'explanation':explanation}
    encoders['videos'] = videos
    encoders['audios'] = audios
    encoders['subtitles'] = subtitles
    return encoders



def getGuidance(type='encoder', format='libx264'):
    result = os.popen('ffmpeg -h {0}={1}'.format(type,format))
    parameters = {}
    paraName = ''
    paraType = ''
    isStart = False
    for line in result.readlines():
        line = line.strip('\n')
        line = line.split(' ')
        line = list(filter(lambda x : x!='', line))
        if not isStart or not line:
            if len(line)>0 and line[-1] == 'AVOptions:':
                isStart = True
            continue
        name = line[0] if line else 0
        if name and name[0] == '-':
            paraName = name
            parameters[name] = {}
            paraType = parameters[name]['valueType'] = line[1][1:-1] if len(line)>1 else None
            parameters[name]['explanation'] = ' '.join(line[3:]) if len(line)>3 else None
        else:
            if 'subValues' not in parameters[paraName]:
                parameters[paraName]['subValues'] = {}
            parameters[paraName]['subValues'][name] = {}
            if paraType.count('flag'):
                parameters[paraName]['subValues'][name]['value'] = name if len(line)>1 else None
                parameters[paraName]['subValues'][name]['explanation'] = ' '.join(line[2:]) if len(line)>3 else None
            else:
                parameters[paraName]['subValues'][name]['value'] = line[1] if len(line)>1 else None
                parameters[paraName]['subValues'][name]['explanation'] = ' '.join(line[3:]) if len(line)>3 else None
    """ parameters = json.dumps(parameters, indent=4)
    print(parameters) """
    return parameters

        


if __name__ == '__main__':

    encoders = getEncoders()
    fEncoder = open('public/Encoders.json','x',encoding='utf-8')
    fEncoder.write(json.dumps(encoders, indent=4))
    fEncoder.close()
    f = open('src/data/Guidance.json','x',encoding='utf-8')
    guidance = {}
    for key, value in encoders.items():
        for encoder in value.keys():
            guidance[encoder] = getGuidance(format=encoder)
    
    """ 
    guidance['libx264'] = getGuidance(format='libx264')
    guidance['libx265'] = getGuidance(format='libx265')
    guidance['libaom-av1'] = getGuidance(format='libaom-av1')
    guidance['flac'] = getGuidance(format='flac') 
    """
    guidance = json.dumps(guidance, indent=4)
    f.write(guidance)
    f.close() 
