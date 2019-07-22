import {dist, epsilon2, mag, mag2, Vector} from "./Algebra";
import {Vector3} from "./Vector3";

/**
 * @brief 3x3 matrices
 * @details Represents dense square matrices of dimension 3
 *
 * - components are ordered as column eg. `m[2]` denotes the value at first column and third row
 *
 * - A row index will always be noted `i` and a column index `j`
 *
 * - components accessors `.ij` such that `i` and `j` can be equal to `x`, `y` or `z`. eg. `m.xy === m[3]` and `m.yx === m[1]`
 *
 * - interface with [[Vector3]] `x`, `y`, `z`, ...
 *
 * - **row and columns** accessors `row`, `col`, ...
 *
 * - **extended algebraical operations** `adj`, `pow`, `at`, ...
 *
 * - **many generators** `diag`, `sym`, `scalar`, `rotX`, ...
 *
 * - inherits from `Float64Array` in order to provide double precision computation
 */
export class Matrix3 extends Float64Array implements Vector {
    dim: Readonly<number> = 9;

    /** first row as vector **/
    get x(): Vector3 {
        return new Vector3(this[0], this[1], this[2]);
    };

    set x(newX) {
        this[0] = newX[0];
        this[3] = newX[1];
        this[6] = newX[2];
    }

    /** second row as vector **/
    get y(): Vector3 {
        return new Vector3(this[3], this[4], this[5]);
    };

    set y(newY) {
        this[1] = newY[0];
        this[4] = newY[1];
        this[7] = newY[2];
    }

    /** third row as vector **/
    get z(): Vector3 {
        return new Vector3(this[6], this[7], this[8]);
    };

    set z(newZ) {
        this[2] = newZ[0];
        this[5] = newZ[1];
        this[8] = newZ[2];
    }

    /** rows of the matrix as vectors */
    get xyz(): [Vector3, Vector3, Vector3] {
        return [
            new Vector3(this[0], this[3], this[6]),
            new Vector3(this[1], this[4], this[7]),
            new Vector3(this[2], this[5], this[8])
        ];
    }

    set xyz(rows) {
        this[0] = rows[0][0];
        this[1] = rows[1][0];
        this[2] = rows[2][0];
        this[3] = rows[0][1];
        this[4] = rows[1][1];
        this[5] = rows[2][1];
        this[6] = rows[0][2];
        this[7] = rows[1][2];
        this[8] = rows[2][2];
    }

    /** columns of the matrix as vectors */
    get xyzt(): [Vector3, Vector3, Vector3] {
        return [
            new Vector3(this[0], this[1], this[2]),
            new Vector3(this[3], this[4], this[5]),
            new Vector3(this[6], this[7], this[8])
        ];
    }

    set xyzt(cols) {
        this[0] = cols[0][0];
        this[1] = cols[0][1];
        this[2] = cols[0][2];
        this[3] = cols[1][0];
        this[4] = cols[1][1];
        this[5] = cols[1][2];
        this[6] = cols[2][0];
        this[7] = cols[2][1];
        this[8] = cols[2][2];
    }

    get mag(): number {
        return mag(this);
    }

    get mag2(): number {
        return mag2(this);
    }

    /** determinant of the matrix */
    get det(): number {
        const mxx = this[0],
            myx = this[1],
            mzx = this[2],
            mxy = this[3],
            myy = this[4],
            mzy = this[5],
            mxz = this[6],
            myz = this[7],
            mzz = this[8];
        return mxx * (mzz * myy - mzy * myz) + myx * (-mzz * mxy + mzy * mxz) + mzx * (myz * mxy - myy * mxz);
    }

    /** constructs a matrix by explicitly giving components ordered by rows */
    constructor(xx: number, xy: number, xz: number,
                yx: number, yy: number, yz: number,
                zx: number, zy: number, zz: number) {
        super(9);
        this[0] = xx;
        this[1] = yx;
        this[2] = zx;
        this[3] = xy;
        this[4] = yy;
        this[5] = zy;
        this[6] = xz;
        this[7] = yz;
        this[8] = zz;
    }

    equal(m: Matrix3) : boolean{
        return this.dist2(m) < epsilon2;
    }

    zero() : boolean{
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];

        return xx * xx + yx * yx + zx * zx + xy * xy + yy * yy + zy * zy + xz * xz + yz * yz + zz * zz < epsilon2;
    }

    string() :string{
        return `(${this[0]}, ${this[3]}, ${this[6]})\n` +
            `(${this[1]}, ${this[4]}, ${this[7]})\n` +
            `(${this[2]}, ${this[5]}, ${this[8]})`;
    }

    array() : number[]{
        return [...this];
    }

    /** explicitly sets all the component of the matrix */
    assign(xx: number, xy: number, xz: number,
           yx: number, yy: number, yz: number,
           zx: number, zy: number, zz: number) : this{
        this[0] = xx;
        this[1] = yx;
        this[2] = zx;
        this[3] = xy;
        this[4] = yy;
        this[5] = zy;
        this[6] = xz;
        this[7] = yz;
        this[8] = zz;
        return this;
    }

    copy(m: Matrix3): this {
        this[0] = m[0];
        this[1] = m[1];
        this[2] = m[2];
        this[3] = m[3];
        this[4] = m[4];
        this[5] = m[5];
        this[6] = m[6];
        this[7] = m[7];
        this[8] = m[8];
        return this;
    }

    clone() : Matrix3 {
        return new Matrix3(
            this[0],
            this[3],
            this[6],
            this[1],
            this[4],
            this[7],
            this[2],
            this[5],
            this[8]
        );
    }

    reset0():this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        return this;
    }

    /** sets matrix to identity */
    reset1():this {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 1;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 1;
        return this;
    }

    fill(s: number):this {
        this[0] = s;
        this[1] = s;
        this[2] = s;
        this[3] = s;
        this[4] = s;
        this[5] = s;
        this[6] = s;
        this[7] = s;
        this[8] = s;
        return this;
    }

    fillc(s: number):Matrix3 {
        return this.clone().fill(s);
    }

    norm(): this {
        const s = mag(this);
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        this[3] /= s;
        this[4] /= s;
        this[5] /= s;
        this[6] /= s;
        this[7] /= s;
        this[8] /= s;
        return this;
    }

    normc() : Matrix3{
        return this.clone().norm();
    }

    add(m: Matrix3):this{
        this[0] += m[0];
        this[1] += m[1];
        this[2] += m[2];
        this[3] += m[3];
        this[4] += m[4];
        this[5] += m[5];
        this[6] += m[6];
        this[7] += m[7];
        this[8] += m[8];
        return this;
    }

    addc(m: Matrix3) :Matrix3{
        return this.clone().add(m);
    }

    sub(m: Matrix3) : this{
        this[0] -= m[0];
        this[1] -= m[1];
        this[2] -= m[2];
        this[3] -= m[3];
        this[4] -= m[4];
        this[5] -= m[5];
        this[6] -= m[6];
        this[7] -= m[7];
        this[8] -= m[8];
        return this;
    }

    subc(m: Matrix3): Matrix3 {
        return this.clone().sub(m);
    }

    neg(): this {
        this[0] *= -1;
        this[1] *= -1;
        this[2] *= -1;
        this[3] *= -1;
        this[4] *= -1;
        this[5] *= -1;
        this[6] *= -1;
        this[7] *= -1;
        this[8] *= -1;
        return this;
    }

    negc(): Matrix3 {
        return this.clone().neg();
    }

    mul(s: number): this {
        this[0] *= s;
        this[1] *= s;
        this[2] *= s;
        this[3] *= s;
        this[4] *= s;
        this[5] *= s;
        this[6] *= s;
        this[7] *= s;
        this[8] *= s;
        return this;
    }

    mulc(s: number): Matrix3 {
        return this.clone().mul(s);
    }

    div(s: number) : this{
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        this[3] /= s;
        this[4] /= s;
        this[5] /= s;
        this[6] /= s;
        this[7] /= s;
        this[8] /= s;
        return this;
    }

    divc(s: number) : Matrix3{
        return this.clone().div(s);
    }

    lerp(m: Matrix3, t: number) : this{
        this[0] += (m[0] - this[0]) * t;
        this[1] += (m[1] - this[1]) * t;
        this[2] += (m[2] - this[2]) * t;
        this[3] += (m[3] - this[3]) * t;
        this[4] += (m[4] - this[4]) * t;
        this[5] += (m[5] - this[5]) * t;
        this[6] += (m[6] - this[6]) * t;
        this[7] += (m[7] - this[7]) * t;
        this[8] += (m[8] - this[8]) * t;
        return this;
    }

    lerpc(m: Matrix3, t: number): Matrix3 {
        return this.clone().lerp(m, t);
    }

    trans() : this{
        const mxy = this[1],
            mxz = this[2],
            myz = this[5];
        this[1] = this[3];
        this[2] = this[6];
        this[3] = mxy;
        this[5] = this[7];
        this[6] = mxz;
        this[7] = myz;
        return this;
    }

    transc() : Matrix3{
        return this.clone().trans();
    }

    prod(m: Matrix3): this {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        const mxx = m[0],
            myx = m[1],
            mzx = m[2],
            mxy = m[3],
            myy = m[4],
            mzy = m[5],
            mxz = m[6],
            myz = m[7],
            mzz = m[8];
        this[0] = mxx * xx + myx * xy + mzx * xz;
        this[1] = mxx * yx + myx * yy + mzx * yz;
        this[2] = mxx * zx + myx * zy + mzx * zz;
        this[3] = mxy * xx + myy * xy + mzy * xz;
        this[4] = mxy * yx + myy * yy + mzy * yz;
        this[5] = mxy * zx + myy * zy + mzy * zz;
        this[6] = mxz * xx + myz * xy + mzz * xz;
        this[7] = mxz * yx + myz * yy + mzz * yz;
        this[8] = mxz * zx + myz * zy + mzz * zz;
        return this;
    }

    prodc(m: Matrix3): Matrix3 {
        return this.clone().prod(m);
    }

    inv() :this{
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        const dyx = zz * yy - zy * yz;
        const dyy = -zz * xy + zy * xz;
        const dyz = yz * xy - yy * xz;

        let det = xx * dyx + yx * dyy + zx * dyz;

        if (!det) {
            return undefined;
        }

        det = 1.0 / det;
        this[0] = dyx * det;
        this[1] = (-zz * yx + zx * yz) * det;
        this[2] = (zy * yx - zx * yy) * det;
        this[3] = dyy * det;
        this[4] = (zz * xx - zx * xz) * det;
        this[5] = (-zy * xx + zx * xy) * det;
        this[6] = dyz * det;
        this[7] = (-yz * xx + yx * xz) * det;
        this[8] = (yy * xx - yx * xy) * det;
        return this;
    }

    invc() : Matrix3{
        return this.clone().inv();
    }

    dot(m: Matrix3) : number {
        const sxx = this[0] * m[0],
            syx = this[1] * m[1],
            szx = this[2] * m[2],
            sxy = this[3] * m[3],
            syy = this[4] * m[4],
            szy = this[5] * m[5],
            sxz = this[6] * m[6],
            syz = this[7] * m[7],
            szz = this[8] * m[8];
        return sxx + syx + szx + sxy + syy + szy + sxz + syz + szz;
    }

    dist(m: Matrix3) :number{
        return dist(this, m);
    }

    dist2(m: Matrix3): number {
        const dxx = this[0] - m[0],
            dyx = this[1] - m[1],
            dzx = this[2] - m[2],
            dxy = this[3] - m[3],
            dyy = this[4] - m[4],
            dzy = this[5] - m[5],
            dxz = this[6] - m[6],
            dyz = this[7] - m[7],
            dzz = this[8] - m[8];
        const dxx2 = dxx * dxx,
            dyx2 = dyx * dyx,
            dzx2 = dzx * dzx,
            dxy2 = dxy * dxy,
            dyy2 = dyy * dyy,
            dzy2 = dzy * dzy,
            dxz2 = dxz * dxz,
            dyz2 = dyz * dyz,
            dzz2 = dzz * dzz;
        return dxx2 + dyx2 + dzx2 + dxy2 + dyy2 + dzy2 + dxz2 + dyz2 + dzz2;
    }

    /** i-th row of the matrix */
    row(i: number): number[] {
        return [this[i], this[3 + i], this[6 + i]];
    }

    /** j-th column of the matrix */
    col(j: number): number[] {
        let shift = 3 * j;
        return [this[shift], this[1 + shift], this[2 + shift]];
    }

    /**
     * @brief product between matrix and vector
     * @details the result is stored in `u`
     * @returns reference to `u`
     */
    at(u: Vector3) : Vector3 {
        let ux = u[0],
            uy = u[1],
            uz = u[2];
        u[0] = this[0] * ux + this[3] * uy + this[6] * uz;
        u[1] = this[1] * ux + this[4] * uy + this[7] * uz;
        u[2] = this[2] * ux + this[5] * uy + this[8] * uz;
        return u;
    }

    atc(u: Vector3) : Vector3 {
        return this.at(u.clone());
    }

    private rpow(exp: number) {
        if (exp > 1) {
            const copy = this.clone();
            this.prod(copy);
            if (exp % 2 === 0) {
                this.rpow(exp / 2);
            } else if (exp % 2 === 1) {
                this.rpow((exp - 1) / 2);
                this.prod(copy);
            }
        }
    }

    /** exponentiation of a matrix with positive and negative integer exponent. */
    pow(exp: number) : this{
        if (exp < 0)
            this.inv();
        if (exp === 0)
            this.assign(1, 0, 0, 0, 1, 0, 0, 0, 1);
        this.rpow(Math.abs(exp));
        return this;
    }

    powc(exp: number) : Matrix3 {
        return this.clone().pow(exp);
    }

    /** adjoint matrix */
    adj() : this {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        this[0] = yy * zz - zy * yz;
        this[1] = zx * yz - yx * zz;
        this[2] = yx * zy - zx * yy;
        this[3] = zy * xz - xy * zz;
        this[4] = xx * zz - zx * xz;
        this[5] = zx * xy - xx * zy;
        this[6] = xy * yz - yy * xz;
        this[7] = yx * xz - xx * yz;
        this[8] = xx * yy - yx * xy;
        return this;
    }

    adjc() : Matrix3 {
        return this.clone().adj();
    }

    static get dim() : number {
        return 9;
    }

    static get zeros() : Matrix3 {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    static get ones() : Matrix3 {
        return new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
    }

    /**
     * @brief identity matrix
     * @details Diagonal matrix filled with `1`.
     */
    static get eye() : Matrix3 {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * @brief scalar matrix
     * @details Diagonal matrix filled with a single value.
     * @param s scalar value
     */
    static scalar(s: number) : Matrix3 {
        return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
    }

    /** diagonal matrix */
    static diag(xx: number, yy: number, zz: number) : Matrix3 {
        return new Matrix3(xx, 0, 0, 0, yy, 0, 0, 0, zz);
    }

    /**
     * @brief symmetric matrix
     * @details Fill the matrix by giving values on diagonal.
     */
    static sym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0) : Matrix3 {
        return new Matrix3(xx, xy, xz, xy, yy, yz, xz, yz, zz);
    }

    /**
     * @brief antisymmetric matrix
     * @details Fill the matrix by giving values on diagonals.
     */
    static asym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0) : Matrix3 {
        return new Matrix3(xx, xy, xz, -xy, yy, yz, -xz, -yz, zz);
    }

    /**
     * @brief canonical matrix
     * @details Matrix with `0` everywhere except in `i`, `j` position where there is a `1`.
     */
    static e(i: number, j: number) : Matrix3 {
        const eij = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        eij[3 * j + i] = 1;
        return eij;
    }

    /**
     * @brief rotation matrix of axis (`0`, `ex`)
     * @details Anticlockwise rotation.
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    static rotX(theta: number, cos = Math.cos, sin = Math.sin) : Matrix3 {
        const c = cos(theta), s = sin(theta);
        return new Matrix3(1, 0, 0, 0, c, -s, 0, s, c);
    }

    /**
     * @brief rotation matrix of axis (`0`, `ey`)
     * @details Anticlockwise rotation.
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    static rotY(theta: number, cos = Math.cos, sin = Math.sin) : Matrix3 {
        const c = cos(theta), s = sin(theta);
        return new Matrix3(c, 0, s, 0, 1, 0, -s, 0, c);
    }

    /**
     * @brief rotation matrix of axis (`0`, `ez`)
     * @details Anticlockwise rotation.
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    static rotZ(theta: number, cos = Math.cos, sin = Math.sin) : Matrix3 {
        const c = cos(theta), s = sin(theta);
        return new Matrix3(c, -s, 0, s, c, 0, 0, 0, 1);
    }

    /**
     * @brief rotation matrix with around axis
     * @details Anticlockwise rotation.
     * @param u axis of rotation
     * @param theta angle of ration
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    static rot(u: Vector3, theta: number, cos = Math.cos, sin = Math.sin) : Matrix3 {
        const c = cos(theta), s = sin(theta), k = 1 - c;
        const ux = u[0],
            uy = u[1],
            uz = u[2];
        const kuxy = k * ux * uy,
            kuxz = k * ux * uz,
            kuyz = k * uy * uz;
        return new Matrix3(
            k * ux * ux + c, kuxy - uz * s, kuxz + uy * s,
            kuxy + uz * s, k * uy * uy + c, kuyz - ux * s,
            kuxz - uy * s, kuyz + ux * s, k * uz * uz + c
        );
    }

    /**
     * @brief affine transformation of the vector
     * @details The result of the operation is stored on `v`.
     * @param m matrix of the transformation
     * @param u translation of the transformation
     * @param v vector parameter of the transformation
     * @returns reference to `v`
     */
    static affine(m: Matrix3, u: Vector3, v: Vector3) : Vector3 {
        const vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = m[0] * vx + m[3] * vy + m[6] * vz + u[0];
        v[1] = m[1] * vx + m[4] * vy + m[7] * vz + u[1];
        v[2] = m[2] * vx + m[5] * vy + m[8] * vz + u[2];
        return v;
    }

    /** tensor product of two vectors */
    static tensor(u: Vector3, v = u) : Matrix3 {
        return new Matrix3(
            u[0] * v[0], u[0] * v[1], u[0] * v[2],
            u[1] * v[0], u[1] * v[1], u[1] * v[2],
            u[2] * v[0], u[2] * v[1], u[2] * v[2],
        );
    }

    /** matrix from given 1D array containing the components of the matrix ordered as rows */
    static array(arr: number[]) : Matrix3 {
        return new Matrix3(
            arr[0], arr[1], arr[2],
            arr[3], arr[4], arr[5],
            arr[6], arr[7], arr[8]);
    }

    /** matrix from 2D array of number ordered such that `arr[i]` is the i-th row of the matrix */
    static array2(arr: number[][]) : Matrix3 {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]);
    }

    /** matrix from [[Vector3]] objects as rows */
    static xyz(arr: [Vector3, Vector3, Vector3]) : Matrix3 {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]
        );
    }
}