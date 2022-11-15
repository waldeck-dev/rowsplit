# ✂️ Rowsplit

A CSV row splitter

## Usage

### Max rows per file

```sh
# Split original files into files of maximun 999 rows
rowsplit --in ./my/huge/file.csv --name chunk --rows 999

>>> chunk1.csv  # 999 rows
>>> chunk2.csv  # 999 rows
>>> chunk3.csv  # 999 rows
...
```

### File number
```sh
# Split original files into 3 files
rowsplit --in ./my/huge/file.csv --ext txt --files 3

# example: 3700 rows / 3 files
>>> split1.txt  # 1234 rows
>>> split2.txt  # 1233 rows
>>> split3.txt  # 1233 rows
```

## Options

| **Option** | **Description** | **Default** |
|---|---|---|
| `--in` | Input file to be splitted | ***(required)*** |
| `--rows` | Number of rows per file | `999` |
| `--files` | Number of file to output. Ignore -rows if set | - |
| `--name` | Name of splitted flie | `split` |
| `--ext` | File extension to be used for splitted files | `csv` |
