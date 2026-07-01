unit Everything;

interface

// Single-line comment (double slash)
//  outro comentario de linha com acentuacao

{ Block comment with braces
  Multiple lines
  spanning across
  several lines
}

(* Block comment with paren-star
   Alternative block comment style
   spanning multiple lines
*)

/// <summary>
///  XML Documentation comment for the unit.
///  Describes the purpose of this module.
/// </summary>
/// <remarks>
///  This unit contains all Delphi language elements for theme testing.
/// </remarks>

uses
  System.SysUtils,
  System.Classes,
  System.Generics.Collections,
  System.Rtti,
  System.TypInfo;

type
  TWeekDay = (wdMonday, wdTuesday, wdWednesday, wdThursday, wdFriday, wdSaturday, wdSunday);

  TWeekDayScoped = (Mon, Tue, Wed, Thu, Fri, Sat, Sun);

  TWeekend = set of TWeekDay;

  TStaticArray = array [0 .. 9] of Integer;
  TMultiDim = array [0 .. 4, 0 .. 3] of string;
  TEnumIndexed = array [TWeekDay] of Boolean;

  TLocation = (locLocal, locRemote, locHybrid);

  TPerson = class;

  TLogEvent = procedure(const Sender: TObject; const Msg: string) of object;
  TCalcFunc = reference to function(A, B: Integer): Integer;

  ICustomAttribute = interface
    ['{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}']
    function GetDescription: string;
    property Description: string read GetDescription;
  end;

  ITaggable = interface
    ['{B2C3D4E5-F6A7-8901-BCDE-F12345678901}']
    function GetTags: TArray<string>;
    procedure SetTags(const Value: TArray<string>);
    property Tags: TArray<string> read GetTags write SetTags;
  end;

  TVersion = record
    Major: Integer;
    Minor: Integer;
    Build: Integer;
    class operator Add(const A, B: TVersion): TVersion;
    class operator Equal(const A, B: TVersion): Boolean;
    function ToString: string;
  end;

  TPackedPoint = packed record
    X: SmallInt;
    Y: SmallInt;
  end;

  TPoint3D = record
  private
    FX: Double;
    FY: Double;
    FZ: Double;
  public
    constructor Create(AX, AY, AZ: Double);
    property X: Double read FX write FX;
    property Y: Double read FY write FY;
    property Z: Double read FZ write FZ;
  end;

  THugeBuffer = array [0 .. 1023] of Byte;

  TGenericList<T: class, constructor> = class(TList<T>)
  private
    FOwner: TObject;
  public
    constructor Create(AOwner: TObject);
    function FirstOrDefault: T;
    procedure ForEach(const AAction: TProc<T>);
  end;

  TNullable<T> = record
  private
    FHasValue: Boolean;
    FValue: T;
  public
    class operator Implicit(const AValue: T): TNullable<T>;
    class operator Implicit(const AValue: TNullable<T>): T;
    function GetValueOrDefault(const ADefault: T): T;
    property HasValue: Boolean read FHasValue;
  end;

  TAccountType = (atChecking, atSavings, atInvestment);

  TOptionalConfig = record
    UseCache: Boolean;
    CacheSize: Integer;
    class function Default: TOptionalConfig; static;
  end;

  IAccount = interface
    ['{C3D4E5F6-A7B8-9012-CDEF-123456789012}']
    function GetBalance: Currency;
    function GetAccountType: TAccountType;
    property Balance: Currency read GetBalance;
    property AccountType: TAccountType read GetAccountType;
  end;

  IBudget = interface(IAccount)
    ['{D4E5F6A7-B8C9-0123-DEF1-234567890123}']
    procedure SetSpendingLimit(const AValue: Currency);
    function CanSpend(const AAmount: Currency): Boolean;
  end;

  [DisplayName('Person Record')]
  TPerson = class(TInterfacedObject, IAccount, ITaggable)
  private
    FName: string;
    FAge: Integer;
    FBalance: Currency;
    FAccountType: TAccountType;
    FTags: TArray<string>;
    FReadOnlyValue: string;
    FWriteOnlyValue: Integer;
    function GetReadOnly: string;
    procedure SetWriteOnly(const AValue: Integer);
  protected
    function GetBalance: Currency;
    function GetAccountType: TAccountType;
    function GetTags: TArray<string>;
    procedure SetTags(const Value: TArray<string>);
  public
    constructor Create(const AName: string; AAge: Integer);
    destructor Destroy; override;

    class function CreateAnonymous(const AName: string; AAge: Integer): TPerson;

    property Name: string read FName write FName;
    property Age: Integer read FAge write FAge;
    property Balance: Currency read FBalance write FBalance;
    property AccountType: TAccountType read FAccountType;
    property Tags: TArray<string> read GetTags write SetTags;
    property ReadOnly: string read GetReadOnly;
    property WriteOnly: Integer write SetWriteOnly;

    function Introduce(const AGreeting: string): string; virtual;

    procedure DoSomething; overload;
    procedure DoSomething(const AParam: Integer); overload;
    procedure DoSomething(const AParam: string; ACount: Integer = 1); overload;
  end;

  TEmployee = class(TPerson)
  private
    FSalary: Currency;
    FDepartment: string;
    FHireDate: TDateTime;
  public
    constructor Create(const AName: string; AAge: Integer; const ADepartment: string);
    function Introduce(const AGreeting: string): string; override;

    property Salary: Currency read FSalary write FSalary;
    property Department: string read FDepartment;
    property HireDate: TDateTime read FHireDate write FHireDate;
  end;

  TEmployeeHelper = class helper for TEmployee
    function YearsOfService: Integer;
    function IsSenior: Boolean;
  end;

  TRecordHelper = record helper for TPoint3D
    function Magnitude: Double;
    function Normalize: TPoint3D;
  end;

  TService = class
  public
    class function CreateInstance: TService; virtual; abstract;
    procedure Execute; virtual; abstract;
  end;

  TDatabaseService = class sealed(TService)
  private
    FConnectionString: string;
  public
    constructor Create(const AConnectionString: string);
    class function CreateInstance: TService; override;
    procedure Execute; override; final;
  end;

  IWeakRef = interface
    ['{E5F6A7B8-C9D0-1234-EF12-345678901234}']
    function IsAlive: Boolean;
  end;

  EBusinessError = class(Exception)
  private
    FErrorCode: Integer;
  public
    constructor Create(const AMsg: string; ACode: Integer);
    property ErrorCode: Integer read FErrorCode;
  end;

  EValidationError = class(EBusinessError)
  private
    FFieldName: string;
  public
    constructor Create(const AMsg: string; const AField: string);
    property FieldName: string read FFieldName;
  end;

resourcestring
  S_AppTitle = 'My Application';
  S_Welcome = 'Welcome, %s!';
  S_ErrorFileNotFound = 'File not found: %s';
  S_ConfirmDelete = 'Are you sure you want to delete this item?';

threadvar
  ThreadContext: Pointer;
  ThreadRequestId: string;

var
  GlobalCounter: Integer = 0;
  GlobalConfig: TOptionalConfig;
  GlobalAppName: string;

const
  C_MaxRetries = 3;
  C_DefaultPort = 8080;
  C_AppVersion: TVersion = (Major: 1; Minor: 0; Build: 42);
  C_EmptyGuid: TGUID = '{00000000-0000-0000-0000-000000000000}';
  C_HexMask = $FF;
  C_BinaryMask = %10101010;
  C_OctalMask = &777;
  C_CharBell = #7;
  C_CharCtrlM = ^M;
  C_LargeFloat = 3.14159265358979;
  C_Scientific = 1.5e-10;
  C_SingleQuote = '''';
  C_PathDelim = '\';
  C_CompanyName = 'Acme Corp';

type
  TGenericPair<K, V> = record
    Key: K;
    Value: V;
    function ToString: string;
  end;

  TStringDictionary<TValue> = class(TDictionary<string, TValue>)
  public
    function TryGetStringValue(const AKey: string; var AResult: TValue): Boolean;
  end;

  TMathOp = (opAdd, opSubtract, opMultiply, opDivide);

  TCalculation = record
    OperandA: Double;
    OperandB: Double;
    Operation: TMathOp;
    function Compute: Double;
    class operator Add(const A, B: TCalculation): TCalculation;
    class operator Subtract(const A, B: TCalculation): TCalculation;

    class operator Multiply(const A, B: TCalculation): TCalculation;
    class operator Divide(const A, B: TCalculation): TCalculation;
  end;

  TCallbackRegistry = class
  private
    FCallbacks: TList<TProc>;
  public
    constructor Create;
    destructor Destroy; override;
    procedure Register(const ACallback: TProc);
    procedure InvokeAll;
  end;

  TAdvancedPerson = class(TPerson)
  private
    FMetadata: TDictionary<string, Variant>;
  public
    constructor Create(const AName: string; AAge: Integer);
    destructor Destroy; override;
    procedure SetMeta(const AKey: string; const AValue: Variant);
    function GetMeta(const AKey: string): Variant;
    function HasMeta(const AKey: string): Boolean;
  end;

function AddInts(A, B: Integer): Integer; inline;
function SafeDivide(const ADividend, ADivisor: Double; out AResult: Double): Boolean;
procedure LogMessage(const AMsg: string); overload;
procedure LogMessage(const AMsg: string; const AArgs: array of const); overload;

implementation

uses
  System.Math,
  System.StrUtils,
  System.Variants,
  System.SyncObjs;

const
  C_UnitName = 'Everything';
  C_SpecialChars: array [0 .. 3] of Char = (#13, #10, #9, #0);

var
  UnitCounter: Integer;

resourcestring
  S_UnitInternal = 'Internal resource string in implementation section';

function AddInts(A, B: Integer): Integer;
begin
  Result := A + B;
end;

function SafeDivide(const ADividend, ADivisor: Double; out AResult: Double): Boolean;
begin
  Result := ADivisor <> 0.0;
  if Result then
    AResult := ADividend / ADivisor
  else
    AResult := 0.0;
end;

procedure LogMessage(const AMsg: string);
begin
  if AMsg <> '' then
    System.WriteLn(AMsg);
end;

procedure LogMessage(const AMsg: string; const AArgs: array of const);
begin
  LogMessage(Format(AMsg, AArgs));
end;

constructor TOptionalConfig.Default: TOptionalConfig;
begin
  Result.UseCache := True;
  Result.CacheSize := 256;
end;

constructor TVersion.Create;
begin
end;

function TVersion.ToString: string;
begin
  Result := Format('%d.%d.%d', [Major, Minor, Build]);
end;

class operator TVersion.Add(const A, B: TVersion): TVersion;
begin
  Result.Major := A.Major + B.Major;
  Result.Minor := A.Minor + B.Minor;
  Result.Build := A.Build + B.Build;
end;

class operator TVersion.Equal(const A, B: TVersion): Boolean;
begin
  Result := (A.Major = B.Major) and (A.Minor = B.Minor) and (A.Build = B.Build);
end;

constructor TPoint3D.Create(AX, AY, AZ: Double);
begin
  FX := AX;
  FY := AY;
  FZ := AZ;
end;

constructor TGenericList<T>.Create(AOwner: TObject);
begin
  inherited Create;
  FOwner := AOwner;
end;

function TGenericList<T>.FirstOrDefault: T;
begin
  if Count > 0 then
    Result := Items[0]
  else
    Result := Default(T);
end;

procedure TGenericList<T>.ForEach(const AAction: TProc<T>);
var
  Item: T;
  I: Integer;
begin
  for I := 0 to Count - 1 do
  begin
    Item := Items[I];
    AAction(Item);
  end;
end;

class operator TNullable<T>.Implicit(const AValue: T): TNullable<T>;
begin
  Result.FValue := AValue;
  Result.FHasValue := True;
end;

class operator TNullable<T>.Implicit(const AValue: TNullable<T>): T;
begin
  if not AValue.FHasValue then
    raise EInvalidOpException.Create('Nullable has no value');
  Result := AValue.FValue;
end;

function TNullable<T>.GetValueOrDefault(const ADefault: T): T;
begin
  if FHasValue then
    Result := FValue
  else
    Result := ADefault;
end;

constructor TPerson.Create(const AName: string; AAge: Integer);
begin
  inherited Create;
  FName := AName;
  FAge := AAge;
  FBalance := 0.0;
  FReadOnlyValue := 'ReadOnly_' + AName;
  SetLength(FTags, 0);

  asm
    nop
    nop
    nop
    nop
    nop
    nop
    nop
    nop
    nop
    nop
  end;
end;

destructor TPerson.Destroy;
begin
  inherited;
end;

class function TPerson.CreateAnonymous(const AName: string; AAge: Integer): TPerson;
var
  Calc: TCalcFunc;
begin
  Calc := function(A, B: Integer): Integer
  begin
    Result := A * B + AAge;
  end;

  Result := TPerson.Create(AName, Calc(2, 3));
end;

function TPerson.GetBalance: Currency;
begin
  Result := FBalance;
end;

function TPerson.GetAccountType: TAccountType;
begin
  Result := FAccountType;
end;

function TPerson.GetTags: TArray<string>;
begin
  Result := FTags;
end;

procedure TPerson.SetTags(const Value: TArray<string>);
begin
  FTags := Value;
end;

function TPerson.GetReadOnly: string;
begin
  Result := FReadOnlyValue;
end;

procedure TPerson.SetWriteOnly(const AValue: Integer);
begin
  FWriteOnlyValue := AValue;
end;

function TPerson.Introduce(const AGreeting: string): string;
begin
  Result := Format('%s, my name is %s and I am %d years old.', [AGreeting, FName, FAge]);
end;

procedure TPerson.DoSomething;
begin
end;

procedure TPerson.DoSomething(const AParam: Integer);
begin
  Inc(GlobalCounter, AParam);
end;

procedure TPerson.DoSomething(const AParam: string; ACount: Integer);
var
  I: Integer;
begin
  for I := 1 to ACount do
  begin
    if AParam <> '' then
    begin
      if ACount > 10 then
      begin
        if GlobalCounter > 1000 then
        begin
          if Length(AParam) > 5 then
          begin
            if I mod 2 = 0 then
            begin
              if GlobalCounter mod 7 = 0 then
              begin
                try
                  try
                    if Assigned(ThreadContext) then
                    begin
                      if AParam[1] <> ' ' then
                      begin
                        raise EBusinessError.Create(
                          'Nested level test with ' + IntToStr(I), I);
                      end;
                    end;
                  except
                    on E: Exception do
                    begin
                      LogMessage('Inner exception: %s', [E.Message]);
                      raise;
                    end;
                  end;
                finally
                  Dec(GlobalCounter);
                end;
              end;
            end;
          end;
        end;
      end;
    end;
  end;
end;

constructor TEmployee.Create(const AName: string; AAge: Integer; const ADepartment: string);
begin
  inherited Create(AName, AAge);
  FDepartment := ADepartment;
  FSalary := 0;
  FHireDate := Now;
end;

function TEmployee.Introduce(const AGreeting: string): string;
begin
  Result := inherited Introduce(AGreeting) +
    Format(' I work in the %s department.', [FDepartment]);
end;

function TEmployeeHelper.YearsOfService: Integer;
begin
  Result := Trunc((Now - FHireDate) / 365.25);
end;

function TEmployeeHelper.IsSenior: Boolean;
begin
  Result := YearsOfService >= 5;
end;

function TRecordHelper.Magnitude: Double;
begin
  Result := Sqrt(FX * FX + FY * FY + FZ * FZ);
end;

function TRecordHelper.Normalize: TPoint3D;
var
  Mag: Double;
begin
  Mag := Magnitude;
  if Mag > 0 then
  begin
    Result.FX := FX / Mag;
    Result.FY := FY / Mag;
    Result.FZ := FZ / Mag;
  end
  else
    Result := Self;
end;

constructor TDatabaseService.Create(const AConnectionString: string);
begin
  inherited Create;
  FConnectionString := AConnectionString;
end;

class function TDatabaseService.CreateInstance: TService;
begin
  Result := TDatabaseService.Create('localhost:5432');
end;

procedure TDatabaseService.Execute;
begin
end;

constructor EBusinessError.Create(const AMsg: string; ACode: Integer);
begin
  inherited Create(AMsg);
  FErrorCode := ACode;
end;

constructor EValidationError.Create(const AMsg: string; const AField: string);
begin
  inherited Create(AMsg, -1);
  FFieldName := AField;
end;

function TGenericPair<K, V>.ToString: string;
begin
  Result := Format('(%s: %s)', [Key.ToString, Value.ToString]);
end;

function TStringDictionary<TValue>.TryGetStringValue(const AKey: string; var AResult: TValue): Boolean;
begin
  Result := TryGetValue(AKey, AResult);
end;

function TCalculation.Compute: Double;
begin
  case Operation of
    opAdd: Result := OperandA + OperandB;
    opSubtract: Result := OperandA - OperandB;
    opMultiply: Result := OperandA * OperandB;
    opDivide:
      if OperandB <> 0.0 then
        Result := OperandA / OperandB
      else
        raise EMathError.Create('Division by zero');
  end;
end;

class operator TCalculation.Add(const A, B: TCalculation): TCalculation;
begin
  Result.OperandA := A.Compute;
  Result.OperandB := B.Compute;
  Result.Operation := opAdd;
end;

class operator TCalculation.Subtract(const A, B: TCalculation): TCalculation;
begin
  Result.OperandA := A.Compute;
  Result.OperandB := B.Compute;
  Result.Operation := opSubtract;
end;

class operator TCalculation.Multiply(const A, B: TCalculation): TCalculation;
begin
  Result.OperandA := A.Compute;
  Result.OperandB := B.Compute;
  Result.Operation := opMultiply;
end;

class operator TCalculation.Divide(const A, B: TCalculation): TCalculation;
begin
  Result.OperandA := A.Compute;
  Result.OperandB := B.Compute;
  Result.Operation := opDivide;
end;

constructor TCallbackRegistry.Create;
begin
  inherited Create;
  FCallbacks := TList<TProc>.Create;
end;

destructor TCallbackRegistry.Destroy;
begin
  FCallbacks.Free;
  inherited;
end;

procedure TCallbackRegistry.Register(const ACallback: TProc);
begin
  FCallbacks.Add(ACallback);
end;

procedure TCallbackRegistry.InvokeAll;
var
  CB: TProc;
  I: Integer;
begin
  for I := 0 to FCallbacks.Count - 1 do
  begin
    CB := FCallbacks[I];
    CB();
  end;
end;

constructor TAdvancedPerson.Create(const AName: string; AAge: Integer);
begin
  inherited Create(AName, AAge);
  FMetadata := TDictionary<string, Variant>.Create;
end;

destructor TAdvancedPerson.Destroy;
begin
  FMetadata.Free;
  inherited;
end;

procedure TAdvancedPerson.SetMeta(const AKey: string; const AValue: Variant);
begin
  FMetadata.AddOrSetValue(AKey, AValue);
end;

function TAdvancedPerson.GetMeta(const AKey: string): Variant;
begin
  if not FMetadata.TryGetValue(AKey, Result) then
    Result := Null;
end;

function TAdvancedPerson.HasMeta(const AKey: string): Boolean;
begin
  Result := FMetadata.ContainsKey(AKey);
end;

procedure TestIntegers;
var
  DecimalInt: Integer;
  HexInt: Integer;
  BinaryInt: Integer;
  OctalInt: Integer;
  LargeInt: Int64;
begin
  DecimalInt := 42;
  HexInt := $FF;
  BinaryInt := %1010;
  OctalInt := &777;
  LargeInt := 9223372036854775807;

  DecimalInt := -12345;
  DecimalInt := +67890;
end;

procedure TestFloats;
var
  SimpleFloat: Double;
  SciFloat: Double;
  NegFloat: Double;
  CurrencyVal: Currency;
begin
  SimpleFloat := 3.14;
  SciFloat := 1.5e-10;
  NegFloat := -2.7E+5;
  CurrencyVal := 19.99;
end;

procedure TestStrings;
var
  SingleQuoted: string;
  EmptyStr: string;
  StringWithQuotes: string;
  MultiLine: string;
  Escaped: string;
begin
  SingleQuoted := 'Hello, World!';
  EmptyStr := '';
  StringWithQuotes := 'She said "Hello" and left.';
  Escaped := 'Line 1'#13#10'Line 2';
  MultiLine := 'First line' + sLineBreak +
    'Second line' + sLineBreak +
    'Third line';
end;

procedure TestChars;
var
  CharLiteral: Char;
  CtrlChar: Char;
  PoundChar: Char;
begin
  CharLiteral := 'A';
  PoundChar := #65;
  CtrlChar := ^M;
end;

procedure TestPointers;
type
  PInt = ^Integer;
var
  IntPtr: PInt;
  IntVal: Integer;
  VoidPtr: Pointer;
  StrPtr: PChar;
begin
  IntVal := 100;
  IntPtr := @IntVal;
  IntPtr^ := 200;

  VoidPtr := IntPtr;
  StrPtr := 'Hello';
  Inc(StrPtr);
end;

procedure TestLabels;
label
  SkipCalc, EndProc;
var
  X: Integer;
begin
  X := 0;

  if X >= 10 then
    goto EndProc;

  if X mod 3 = 0 then
    goto SkipCalc;

  X := X + 99;

SkipCalc:
  X := X + 1;
  goto SkipCalc;

EndProc:
  Exit;
end;

procedure TestConditionals;
{$IFDEF MSWINDOWS}
begin
  LogMessage('Running on Windows');
end;
{$ENDIF}

{$IFDEF LINUX}
begin
  LogMessage('Running on Linux');
end;
{$ENDIF}

{$IFDEF DEBUG}
var
  DebugVar: string;
begin
  DebugVar := 'debug only';
end;
{$ELSE}
begin
end;
{$ENDIF}

procedure TestEnumsAndSets;
var
  Today: TWeekDay;
  WeekendSet: TWeekend;
  Location: TLocation;
begin
  Today := wdFriday;
  WeekendSet := [wdSaturday, wdSunday];

  if Today in WeekendSet then
    LogMessage('Weekend!');

  Location := locHybrid;
  case Location of
    locLocal: LogMessage('Local');
    locRemote: LogMessage('Remote');
    locHybrid: LogMessage('Hybrid');
  end;
end;

procedure TestArrays;
var
  StaticArr: TStaticArray;
  MultiArr: TMultiDim;
  DynArr: TArray<Integer>;
  OpenArr: array of string;
  I: Integer;
begin
  for I := 0 to 9 do
    StaticArr[I] := I * 10;

  MultiArr[0, 0] := 'origin';
  MultiArr[4, 3] := 'end';

  SetLength(DynArr, 5);
  for I := 0 to High(DynArr) do
    DynArr[I] := I * I;

  OpenArr := TArray<string>.Create('one', 'two', 'three');
end;

procedure TestRecords;
var
  Point: TPoint3D;
  Packet: TPackedPoint;
  Ver: TVersion;
begin
  Point := TPoint3D.Create(1.0, 2.0, 3.0);
  Point.X := 4.0;

  Packet.X := 10;
  Packet.Y := 20;

  Ver.Major := 2;
  Ver.Minor := 5;
  Ver.Build := 1;
  LogMessage(Ver.ToString);
end;

procedure TestGenerics;
var
  IntList: TList<Integer>;
  PersonList: TObjectList<TPerson>;
  GenericPair: TGenericPair<string, Integer>;
  NullableInt: TNullable<Integer>;
begin
  IntList := TList<Integer>.Create;
  try
    IntList.Add(1);
    IntList.Add(2);
    IntList.Add(3);
  finally
    IntList.Free;
  end;

  PersonList := TObjectList<TPerson>.Create;
  try
    PersonList.Add(TPerson.Create('Alice', 30));
  finally
    PersonList.Free;
  end;

  GenericPair.Key := 'answer';
  GenericPair.Value := 42;
  LogMessage(GenericPair.ToString);

  NullableInt := 100;
  if NullableInt.HasValue then
    LogMessage(IntToStr(Integer(NullableInt)));
end;

procedure TestAnonymousMethods;
var
  Person: TPerson;
  Greet: TFunc<string, string>;
  Calc: TCalcFunc;
begin
  Person := TPerson.CreateAnonymous('Bob', 25);
  try
    Greet := function(const Name: string): string
    begin
      Result := 'Hello, ' + Name + '!';
    end;

    Calc := function(A, B: Integer): Integer
    begin
      Result := A * A + B * B;
    end;

    LogMessage(Greet('World'));
    LogMessage(IntToStr(Calc(3, 4)));
  finally
    Person.Free;
  end;
end;

procedure TestAttributes;
var
  Ctx: TRttiContext;
  Typ: TRttiType;
  Attr: TCustomAttribute;
begin
  Ctx := TRttiContext.Create;
  try
    Typ := Ctx.GetType(TPerson);
    for Attr in Typ.GetAttributes do
      if Attr is DisplayNameAttribute then
        LogMessage(DisplayNameAttribute(Attr).DisplayName);
  finally
    Ctx.Free;
  end;
end;

procedure TestExceptions;
var
  Person: TPerson;
begin
  try
    Person := TPerson.Create('Test', 0);
    try
      if Person.Age < 18 then
        raise EValidationError.Create('Age below minimum', 'Age');
      if Person.Name = '' then
        raise EBusinessError.Create('Name is required', 1001);

      try
        Person.DoSomething;
      finally
        LogMessage('Inner finally');
      end;
    except
      on E: EValidationError do
        LogMessage('Validation error on %s: %s', [E.FieldName, E.Message]);
      on E: EBusinessError do
        LogMessage('Business error [%d]: %s', [E.ErrorCode, E.Message]);
      on E: Exception do
        LogMessage('Unknown error: %s', [E.Message]);
    end;
  finally
    Person.Free;
  end;
end;

procedure TestOperators;
var
  Calc1, Calc2, CalcResult: TCalculation;
  Ver1, Ver2, VerResult: TVersion;
  IntA, IntB, IntResult: Integer;
begin
  Calc1.OperandA := 10;
  Calc1.OperandB := 20;
  Calc1.Operation := opAdd;

  Calc2.OperandA := 30;
  Calc2.OperandB := 5;
  Calc2.Operation := opDivide;

  CalcResult := Calc1 + Calc2;
  LogMessage(FloatToStr(CalcResult.Compute));

  CalcResult := Calc1 - Calc2;
  CalcResult := Calc1 * Calc2;
  CalcResult := Calc1 / Calc2;

  IntA := 5;
  IntB := 3;
  IntResult := IntA + IntB;
  IntResult := IntA - IntB;
  IntResult := IntA * IntB;
  IntResult := IntA div IntB;
  IntResult := IntA mod IntB;
  IntResult := IntA shl 2;
  IntResult := IntB shr 1;
  IntResult := IntA xor IntB;
  IntResult := IntA and IntB;
  IntResult := IntA or IntB;
  IntResult := not IntA;
end;

procedure TestProgramFlow;
var
  I: Integer;
  Found: Boolean;
begin
  I := 0;
  while I < 10 do
    Inc(I);

  I := 0;
  repeat
    Inc(I);
  until I >= 10;

  Found := False;
  for I := 1 to 100 do
  begin
    if I mod 7 = 0 then
    begin
      Found := True;
      break;
    end;

    if I mod 2 = 0 then
      continue;
  end;

  with TPerson.Create('WithTest', 20) do
  try
    Name := 'Renamed';
    LogMessage(Name);
  finally
    Free;
  end;
end;

procedure TestInterfaceUsage;
var
  Person: TPerson;
  Account: IAccount;
  Taggable: ITaggable;
begin
  Person := TPerson.Create('Jane', 28);
  try
    if Supports(Person, IAccount, Account) then
      LogMessage(CurrToStr(Account.Balance));

    if Supports(Person, ITaggable, Taggable) then
    begin
      Taggable.Tags := TArray<string>.Create('important', 'urgent');
    end;

    Person := nil;
  finally
    Person.Free;
  end;
end;

procedure TestHelpers;
var
  Emp: TEmployee;
  Pt: TPoint3D;
begin
  Emp := TEmployee.Create('John', 35, 'Engineering');
  try
    Emp.HireDate := EncodeDate(2020, 1, 15);
    if Emp.IsSenior then
      LogMessage('Senior employee');
    LogMessage('Years: %d', [Emp.YearsOfService]);
  finally
    Emp.Free;
  end;

  Pt := TPoint3D.Create(3.0, 4.0, 0.0);
  LogMessage('Magnitude: %f', [Pt.Magnitude]);
  Pt := Pt.Normalize;
end;

procedure TestDollarString;
var
  HelloStr: string;
  WorldStr: string;
  DStr: string;
begin
  HelloStr := 'hello';
  WorldStr := 'world';
  DStr := ${HelloStr}_${WorldStr};
  LogMessage(DStr);
end;

procedure TestThreadvar;
begin
  ThreadRequestId := 'req-' + IntToStr(GlobalCounter);

  if not Assigned(ThreadContext) then
    ThreadContext := @GlobalCounter;
end;

{$R *.res}
{$R ExtraResources.res}

initialization
  UnitCounter := 0;
  GlobalConfig := TOptionalConfig.Default;

finalization
  UnitCounter := -1;

end.
