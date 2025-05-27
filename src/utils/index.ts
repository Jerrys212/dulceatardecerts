export const formatDate = (isoString: string): string => {
    const formatter = new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return formatter.format(new Date(isoString));
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(price);
};
