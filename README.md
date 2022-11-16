# ✂️ Rowsplit

A CSV file splitter

## Usage

```sh
./rowsplit FILE {--rows ROWS | --files FILES} [--name NAME] [--ext EXT]
```

```sh
./rowsplit --help
```

### Max rows per file

```sh
# Split original files into files of maximun 999 rows
./rowsplit ./my/huge/file.csv --name chunk --rows 999

>>> chunk1.csv  # 999 rows
>>> chunk2.csv  # 999 rows
>>> chunk3.csv  # 999 rows
...
```

### File number

```sh
# Split original files into 3 files
./rowsplit ./my/huge/file.csv --ext txt --files 3

# example: 3700 rows / 3 files
>>> split1.txt  # 1234 rows
>>> split2.txt  # 1233 rows
>>> split3.txt  # 1233 rows
```

## Options

| **Option**            | **Description**                              | **Default**                                              |
| --------------------- | -------------------------------------------- | -------------------------------------------------------- |
| `FILE`                | Input file to be splitted                    | _**(required)**_                                         |
| `-r, --rows <int>`    | Number of rows per file                      | _**(required, conflicts --files)**_ |
| `-f, --files <int>`   | Number of file to output                     | _**(required, conflicts --rows)**_                       |
| `-n, --name <string>` | Name of splitted file                        | `split`                                                  |
| `-x, --ext <string>`  | File extension to be used for splitted files | `csv`                                                    |
