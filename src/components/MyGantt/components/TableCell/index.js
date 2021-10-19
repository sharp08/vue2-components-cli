export default {
    name: "TableCell",
    functional: true,
    props: {
        render: {
            type: Function
        }
    },
    render: (h, ctx) => ctx.props.render(h)
}