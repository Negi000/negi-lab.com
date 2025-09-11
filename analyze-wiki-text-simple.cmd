@echo off
echo ファイルサイズ一覧（キャラクターページ）
dir /b "c:\Users\241822\Desktop\新しいフォルダー (2)\negi-lab.com\gamewiki\FellowMoon\site\chars\*.html" | findstr /v /c:"index.html" /c:"character.html" > temp_files.txt

echo ファイル名, サイズ(バイト)
for /f %%f in (temp_files.txt) do (
    set file=%%f
    for %%s in ("c:\Users\241822\Desktop\新しいフォルダー (2)\negi-lab.com\gamewiki\FellowMoon\site\chars\%%f") do (
        echo %%f, %%~zs
    )
)

del temp_files.txt
