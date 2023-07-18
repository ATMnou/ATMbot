from wordcloud import WordCloud
from collections import Counter
from kiwipiepy import Kiwi
from tqdm import tqdm
import sys
# args = sys.argv[1:]
# when = args[0]
when = "20230718"
kiwi = Kiwi()

st = open('stopwords.txt', 'r', encoding='utf-8')
stop_words = st.readlines()
stop_words = stop_words[0].split(' ')
f = open('chatdata_'+when+'.txt', 'r', encoding='utf-8')
raw = f.readlines()

token = []
for rv in tqdm(raw):
    for tk in kiwi.tokenize(rv):
        if (tk.tag[0] == 'N') & (tk.form not in stop_words):
            token.append(tk.form)

c = Counter(token)
top_c = c.most_common(25)
top_c = dict(top_c)


wc = WordCloud(font_path='malgun',  width=800, height=400, scale=2.0,
               max_font_size=250, max_words=200, background_color='white')
wc.generate_from_frequencies(top_c)
output_file = 'wordcloud.png'
wc.to_file(output_file)
