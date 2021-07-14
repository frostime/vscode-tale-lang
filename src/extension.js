const vscode = require('vscode');

exports.activate = function (context)
{
    console.log('恭喜，您的扩展“Tale”已被激活！');
};


exports.deactivate = function ()
{
    console.log('您的扩展“Tale”已被释放！')
};

/**
 * 字数统计
*/
vscode.commands.registerCommand('tale.count',
    () =>
    {
        const { document } = vscode.window.activeTextEditor;
        const text = document.getText();
        const t_len = text.length;
        const tnb = text.replace(/[　\s\n\r]+/g, '');
        const tnb_len = tnb.length;
        vscode.window.showInformationMessage(
            document.fileName, "总字数: " + t_len, "忽略空白: " + tnb_len
        );
    }
);

/**
 * Format 操作
*/
vscode.languages.registerDocumentFormattingEditProvider(
    'tale',
    {
        /** 实现 Format 操作
         * @param document: vscode.TextDocument
         * @returns: vscode.TextEdit[]
        */
        provideDocumentFormattingEdits(document)
        {
            let format_edit = [];

            for (let index = 0; index < document.lineCount; index++)
            {
                let line = document.lineAt(index);
                let trimed_line = line.text.replace('　　', '').trim();
                if (trimed_line.length > 0)
                {
                    //先导空行
                    const start_pos = line.range.start;
                    //Case 1: 开头即文字
                    if (line.firstNonWhitespaceCharacterIndex == 0)
                    {
                        let text_edit1 = vscode.TextEdit.insert(start_pos, '　　');
                        format_edit.push(text_edit1);
                    }
                    //Case 2: 开头存在空格
                    else
                    {
                        const non_white_char_pos = new vscode.Position(
                            line.lineNumber,
                            line.firstNonWhitespaceCharacterIndex
                        );
                        const range = new vscode.Range(start_pos, non_white_char_pos);
                        let text_edit1 = vscode.TextEdit.replace(range, '　　');
                        format_edit.push(text_edit1);
                    }
                    //空一行
                    let text_edit_new_line = vscode.TextEdit.insert(line.range.end, '\n');
                    format_edit.push(text_edit_new_line);
                    console.log('line', index, line.text);
                }
                else
                {
                    //删除多余空行
                    let blank_line_range = new vscode.Range(
                        line.range.start,
                        new vscode.Position(line.lineNumber + 1, 0)
                    );
                    let text_edit_del = vscode.TextEdit.delete(blank_line_range);
                    console.log('Delete Blank line', blank_line_range);
                    format_edit.push(text_edit_del);
                }
            }
            return format_edit
        }
    }
);
