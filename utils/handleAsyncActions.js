export const handleAsyncActions = (builder, actionType) => {
    builder
        .addCase(actionType.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(actionType.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload.data;
        })
        .addCase(actionType.rejected, (state) => {
            state.status = 'failed';
        });
};
