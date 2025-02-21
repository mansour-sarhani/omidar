export const handleDownload = (data) => {
    const fileUrl = `/api/images?path=${data.path}&url=${data.url}`;
    window.open(fileUrl, '_blank');
};
