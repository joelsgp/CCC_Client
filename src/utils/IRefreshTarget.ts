export default interface IRefreshTarget {
    reload(): Promise<void>;
}