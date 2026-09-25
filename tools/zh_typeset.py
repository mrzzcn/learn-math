#!/usr/bin/env python3
"""按中文排版规范校对 parts/*.md。

用法：python3 tools/zh_typeset.py [--write] [--log FILE] 文件...
不加 --write 时只统计、不改文件。--log 把每处修改（原文 → 改后）写到文件。
代码块、行内代码、链接地址、图片路径、HTML 标签不做任何修改。
"""
import re, sys

HAN = '\u3400-\u4dbf\u4e00-\u9fff'
H = f'[{HAN}]'
AN = '[A-Za-z0-9]'

def mask(line, store):
    pats = [
        r'`[^`]*`',                 # 行内代码
        r'\]\([^)]*\)',             # 链接和图片地址
        r'<[^>\n]+>',               # HTML 标签，如 <br/>
        r'https?://\S+',            # 裸链接
    ]
    def rep(m):
        store.append(m.group(0))
        return f'\x00{len(store)-1}\x00'
    for p in pats:
        line = re.sub(p, rep, line)
    return line

def unmask(line, store):
    return re.sub(r'\x00(\d+)\x00', lambda m: store[int(m.group(1))], line)

def fix_quotes(s):
    # 含汉字的直双引号成对改成中文引号
    parts = s.split('"')
    if len(parts) < 3:
        return s
    out = [parts[0]]
    i = 1
    while i < len(parts):
        inner = parts[i]
        if i + 1 < len(parts):          # 有配对的收引号
            before = ''.join(out).rstrip()[-1:]
            after = parts[i + 1].lstrip()[:1]
            english = (re.match(r'[A-Za-z]', inner[:1] or ' ') is not None) or (
                re.match(r'[A-Za-z*,]', before or ' ') and re.match(r'[A-Za-z*]', after or ' '))
            if re.search(H, inner) and not english:
                out.append('“' + inner + '”')
            else:
                out.append('"' + inner + '"')
            out.append(parts[i + 1])
        else:                           # 落单的引号，原样保留
            out.append('"' + inner)
        i += 2
    return ''.join(out)

def fix_single_quotes(s):
    # 含汉字、两侧不是字母的直单引号成对改成‘’
    # 开引号后紧跟汉字、收引号前紧挨汉字或省略号，才当成引号；所有格的 's、s' 不动
    return re.sub(r"(?<![A-Za-z])'(" + H + r"[^'\n]*?[" + HAN + r"…])'(?![A-Za-z])", r'‘\1’', s)

def fix_bold_spacing(s):
    # 按 ** 切段，判断开合，在加粗标记外侧补空格
    segs = s.split('**')
    if len(segs) < 3:
        return s
    for i in range(len(segs) - 1):
        left, right = segs[i], segs[i + 1]
        if not left or not right:
            continue
        lc, rc = left[-1], right[0]
        need = (re.match(H, lc) and re.match(AN, rc)) or (re.match(AN, lc) and re.match(H, rc))
        if not need:
            continue
        opening = (i % 2 == 0)
        if opening:
            segs[i] = left + ' '
        else:
            segs[i + 1] = ' ' + right
    return '**'.join(segs)

PUNCT_MAP = {',': '，', ';': '；', ':': '：', '?': '？', '!': '！'}

def fix_line(line, stats):
    store = []
    s = mask(line, store)
    orig = s
    # 1. 引号
    t = fix_quotes(s); stats['引号'] += t != s; s = t
    t = fix_single_quotes(s); stats['单引号'] += t != s; s = t
    # 2. 中文语境里的半角标点
    def punct(m):
        return m.group(1) + PUNCT_MAP[m.group(2)]
    t = re.sub(f'({H}|[“”‘’）])([,;:?!])(?![A-Za-z0-9/])', punct, s)
    stats['半角标点'] += t != s; s = t
    # 括号：前面（跳过空格）是汉字、全角标点或英文句末标点时才改成全角；英文句子里的括号（如真题原文）保持原样
    t = re.sub(f'([{HAN}，。：；！？、“”）.?!])( ?)\\(([^()\n]*)\\)', r'\1\2（\3）', s)
    stats['括号'] += t != s; s = t
    # 3. 省略号
    # 省略号：紧挨汉字的 ... 或单个 … 改成 ……；英文里的 …（both … and）保持原样
    t = re.sub(f'({H})(\\.\\.\\.|…)(?!…)', r'\1……', s)
    t = re.sub(f'(?<!…)…(?!…)(?={H})', '……', t)
    stats['省略号'] += t != s; s = t
    # 4. 中英文、中文数字之间的空格
    t = re.sub(f'({H})({AN})', r'\1 \2', s)
    t = re.sub(f'({AN}|[%°])({H})', r'\1 \2', t)
    stats['中英空格'] += t != s; s = t
    t = fix_bold_spacing(s); stats['加粗旁空格'] += t != s; s = t
    # 全角标点两侧不留空格（表格竖线旁的空格保留）
    # 只在标点另一侧是汉字、字母、数字时去空格；箭头、加号、等号等符号旁的空格和列表标记后的空格保留
    NB = f'[{HAN}A-Za-z0-9“”‘’（）]'
    lead = re.match(r'^(\s*(?:\d+\.|[-*])\s+)', s)
    head, body = (lead.group(1), s[lead.end():]) if lead else ('', s)
    body2 = re.sub(r'([，。：；！？、“”‘’（）])[ ]+(?=' + NB + ')', r'\1', body)
    body2 = re.sub(r'(?<=' + NB + r')[ ]+([，。：；！？、“”‘’（）])', r'\1', body2)
    t = head + body2
    stats['全角标点旁空格'] = stats.get('全角标点旁空格', 0) + (t != s); s = t
    # 数字与 % 紧贴
    t = re.sub(r'(\d) %', r'\1%', s); s = t
    return unmask(s, store), s != orig

def main():
    args = sys.argv[1:]
    write = '--write' in args
    log = None
    if '--log' in args:
        log = args[args.index('--log') + 1]
    files = [a for a in args if a.endswith('.md') and a != log]
    stats = {k: 0 for k in ['引号', '单引号', '半角标点', '括号', '省略号', '中英空格', '加粗旁空格']}
    changes = []
    for f in files:
        lines = open(f, encoding='utf-8').read().split('\n')
        out, fence = [], False
        for n, line in enumerate(lines, 1):
            if line.strip().startswith('```'):
                fence = not fence; out.append(line); continue
            if fence:
                out.append(line); continue
            new, changed = fix_line(line, stats)
            if changed:
                changes.append((f, n, line, new))
            out.append(new)
        if write:
            open(f, 'w', encoding='utf-8').write('\n'.join(out))
    print('修改的行数：', len(changes))
    for k, v in stats.items():
        print(f'  {k}：{v} 行')
    if log:
        with open(log, 'w', encoding='utf-8') as fp:
            for f, n, a, b in changes:
                fp.write(f'## {f}:{n}\n原文：{a}\n改后：{b}\n\n')

if __name__ == '__main__':
    main()
