export default {
    name: "TableCell",
    functional: true,
    props: {
        render: {
            type: Function
        },
        row: Object,
        rowIndex: Number
    },
    render: (h, ctx) => {
        const params = {
            row: ctx.props.row,
            index: ctx.props.rowIndex
        }

        return ctx.props.render(h, params)
    }
}