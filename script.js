(function () {
    var el = wp.element.createElement;
    var registerBlockType = wp.blocks.registerBlockType;
    var RichText = wp.blockEditor.RichText;
    var BlockControls = wp.blockEditor.BlockControls;
    var AlignmentToolbar = wp.blockEditor.AlignmentToolbar;

    registerBlockType('custom-table-block/custom-table', {
        title: 'Custom Table Block',
        icon: 'table-row-after',
        category: 'common',
        attributes: {
            rows: {
                type: 'number',
                default: 2,
            },
            columns: {
                type: 'number',
                default: 2,
            },
            tableData: {
                type: 'array',
                default: [['', ''], ['', '']],
            },
            editableHeader: {
                type: 'string',
                default: 'Header 1',
            },
            alignment: {
                type: 'string',
                default: 'left',
            },
        },
        edit: function (props) {
            var attributes = props.attributes;

            function updateCellContent(rowIndex, colIndex, content) {
                var updatedTableData = [...attributes.tableData];

                // Ensure the row is initialized
                if (!updatedTableData[rowIndex]) {
                    updatedTableData[rowIndex] = [];
                }

                // Update the cell content
                updatedTableData[rowIndex][colIndex] = content;

                // Remove empty rows at the end
                while (updatedTableData.length > 0 && updatedTableData[updatedTableData.length - 1].every(cell => cell === '')) {
                    updatedTableData.pop();
                }

                props.setAttributes({ tableData: updatedTableData });
            }

            function handleRowsChange(change) {
                const newRows = Math.max(2, attributes.rows + change);
                props.setAttributes({ rows: newRows });
            }

            function handleColumnsChange(change) {
                const newColumns = Math.max(2, attributes.columns + change);
                props.setAttributes({ columns: newColumns });
            }

            return el(
                'div',
                null,
                el('label', { htmlFor: 'rows' }, 'Number of Rows:'),
                el('div', { className: 'control-wrapper' },
                    el('button', {
                        className: 'control-button',
                        onClick: function () {
                            handleRowsChange(-1);
                        },
                    }, '-'),
                    el('span', { className: 'control-value' }, attributes.rows),
                    el('button', {
                        className: 'control-button',
                        onClick: function () {
                            handleRowsChange(1);
                        },
                    }, '+')
                ),
                el('label', { htmlFor: 'columns' }, 'Number of Columns:'),
                el('div', { className: 'control-wrapper' },
                    el('button', {
                        className: 'control-button',
                        onClick: function () {
                            handleColumnsChange(-1);
                        },
                    }, '-'),
                    el('span', { className: 'control-value' }, attributes.columns),
                    el('button', {
                        className: 'control-button',
                        onClick: function () {
                            handleColumnsChange(1);
                        },
                    }, '+')
                ),
                el(BlockControls, { key: 'controls' },
                    el(AlignmentToolbar, {
                        value: attributes.alignment,
                        onChange: function (newAlignment) {
                            props.setAttributes({ alignment: newAlignment });
                        },
                    })
                ),
                el('table', { className: 'custom-table', style: { textAlign: attributes.alignment } },
                    el('thead', null,
                        el('tr', null,
                            el('th', {
                                key: 'editableHeader',
                                colSpan: attributes.columns,
                            },
                                el(RichText, {
                                    tagName: 'span',
                                    value: attributes.editableHeader,
                                    onChange: function (value) {
                                        props.setAttributes({ editableHeader: value });
                                    },
                                    formattingControls: ['bold', 'italic', 'underline', 'link'],
                                })
                            )
                        )
                    ),
                    el('tbody', null,
                        Array.from({ length: attributes.rows }, function (_, rowIndex) {
                            return el('tr', { key: rowIndex },
                                Array.from({ length: attributes.columns }, function (_, colIndex) {
                                    var cellValue = attributes.tableData[rowIndex] ? attributes.tableData[rowIndex][colIndex] : '';
                                    return el('td', { key: colIndex },
                                        el(RichText, {
                                            tagName: 'span',
                                            value: cellValue,
                                            onChange: function (value) {
                                                updateCellContent(rowIndex, colIndex, value);
                                            },
                                            formattingControls: ['bold', 'italic', 'underline', 'link'],
                                        })
                                    );
                                })
                            );
                        })
                    )
                )
            );
        },
        save: function (props) {
            var attributes = props.attributes;

            return el(
                'div',
                { className: 'custom-table-container' },
                el('table', { className: 'custom-table', style: { textAlign: attributes.alignment } },
                    el('thead', null,
                        el('tr', null,
                            el('th', {
                                colSpan: attributes.columns,
                            },
                                el(RichText.Content, {
                                    value: attributes.editableHeader,
                                })
                            )
                        )
                    ),
                    el('tbody', null,
                        Array.from({ length: attributes.rows }, function (_, rowIndex) {
                            return el('tr', { key: rowIndex },
                                Array.from({ length: attributes.columns }, function (_, colIndex) {
                                    var cellValue = attributes.tableData[rowIndex] ? attributes.tableData[rowIndex][colIndex] : '';
                                    return el('td', { key: colIndex },
                                        el('div', {
                                            dangerouslySetInnerHTML: { __html: cellValue },
                                        })
                                    );
                                })
                            );
                        })
                    )
                )
            );
        },
    });
})();
