export interface KubeResource {
    apiVersion: string,
    kind: string,
    metadata: {
        name?: string
        annotations?: { [key: string]: string }
        labels?: { [key: string]: string }
    }
    spec: object
}
